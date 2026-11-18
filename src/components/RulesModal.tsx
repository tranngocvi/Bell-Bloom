import React from 'react';
import { X, Award, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart?: () => void;
  rules: string[];
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  onStart,
  rules
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border-4 border-[#FFC83D] rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Quy định tham gia</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#084DB8]">
            THỂ LỆ TRÒ CHƠI
          </h2>
          <p className="text-slate-500 font-semibold mt-1">
            Đấu trường tri thức BELL & BLOOM - 15 Câu hỏi chinh phục
          </p>
        </div>

        {/* Rules List */}
        <div className="space-y-4 mb-8">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-sky-50/70 border-2 border-sky-100 hover:border-sky-300 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-[#084DB8] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                {idx + 1}
              </div>
              <div className="flex-1 text-slate-800 font-semibold text-base md:text-lg leading-snug pt-0.5">
                {rule}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition"
          >
            Đóng
          </button>
          {onStart && (
            <button
              onClick={() => {
                onClose();
                onStart();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#FF781F] hover:bg-[#E65D07] text-white font-black text-lg rounded-xl shadow-lg shadow-orange-500/30 transition hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>BẮT ĐẦU NGAY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
