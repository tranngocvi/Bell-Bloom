import { SyncAction } from '../types/quiz';

const CHANNEL_NAME = 'bell_bloom_sync_channel';

class SyncChannelService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((action: SyncAction) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not available, falling back to storage events:', e);
      }
    }

    // Fallback using localStorage storage event
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'bb_sync_trigger' && e.newValue) {
          try {
            const action: SyncAction = JSON.parse(e.newValue);
            this.notifyListeners(action);
          } catch (err) {
            console.error('Storage sync parse error:', err);
          }
        }
      });
    }
  }

  private notifyListeners(action: SyncAction) {
    this.listeners.forEach((listener) => {
      try {
        listener(action);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  public subscribe(callback: (action: SyncAction) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public post(action: SyncAction): void {
    if (this.channel) {
      try {
        this.channel.postMessage(action);
      } catch (e) {
        console.error('BroadcastChannel post error:', e);
      }
    }

    // Trigger storage event for cross-tab fallback
    try {
      localStorage.setItem('bb_sync_trigger', JSON.stringify({ ...action, _ts: Date.now() }));
    } catch {
      // Ignore quota errors if any
    }
  }

  public destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners = [];
  }
}

export const syncService = new SyncChannelService();
