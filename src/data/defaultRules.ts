export const DEFAULT_RULES: string[] = [
  "Lắng nghe và đọc kỹ câu hỏi được trình chiếu trên màn hình.",
  "Suy nghĩ và chọn một đáp án chính xác nhất trong 4 phương án A, B, C hoặc D.",
  "Ghi đáp án lên bảng trả lời trong thời gian đồng hồ đếm ngược.",
  "Khi có hiệu lệnh hết giờ (00 giây), lập tức dừng viết và đồng loạt giơ bảng theo hiệu lệnh của MC.",
  "Theo dõi đáp án chính xác, lời giải thích từ BTC và hướng dẫn tiếp tục của chương trình."
];

export const DEFAULT_SETTINGS = {
  defaultTimeLimit: 15,
  soundEnabled: true,
  animationsEnabled: true,
  rulesText: DEFAULT_RULES,
  winnerName: "",
  customLogoUrl: "/fps-logo.png" as string | null,
  schoolName: "FPT POLYSCHOOL",
  eventTitle: "BELL & BLOOM",
  eventSlogan: "Chuông vang tri thức - Hoa nở tri ân",
  isDemo: true
};
