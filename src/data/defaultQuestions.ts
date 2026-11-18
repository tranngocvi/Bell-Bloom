import { Question } from '../types/quiz';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Ngày Nhà giáo Việt Nam được tổ chức vào ngày nào hằng năm?",
    options: {
      A: "02/09",
      B: "26/03",
      C: "20/11",
      D: "22/12"
    },
    correctOption: "C",
    explanation: "Ngày 20/11 là Ngày Nhà giáo Việt Nam, dịp tôn vinh và tri ân những người làm công tác giáo dục.",
    timeLimit: 15,
    difficulty: "Dễ"
  },
  {
    id: 2,
    question: "“Tôn sư trọng đạo” thể hiện điều gì?",
    options: {
      A: "Kính trọng thầy cô và coi trọng đạo học",
      B: "Chỉ coi trọng điểm số",
      C: "Chỉ học những môn mình thích",
      D: "Chỉ học khi có kiểm tra"
    },
    correctOption: "A",
    explanation: "“Tôn sư trọng đạo” đề cao sự kính trọng người thầy và tinh thần coi trọng việc học.",
    timeLimit: 15,
    difficulty: "Dễ"
  },
  {
    id: 3,
    question: "Từ tiếng Anh nào có nghĩa là “quyển sách”?",
    options: {
      A: "Pen",
      B: "Ruler",
      C: "Desk",
      D: "Book"
    },
    correctOption: "D",
    explanation: "“Book” nghĩa là quyển sách; “pen” là bút, “ruler” là thước và “desk” là bàn học hoặc bàn làm việc.",
    timeLimit: 15,
    difficulty: "Dễ"
  },
  {
    id: 4,
    question: "Hành tinh nào thường được gọi là “Hành tinh Đỏ”?",
    options: {
      A: "Sao Thủy",
      B: "Sao Hỏa",
      C: "Sao Kim",
      D: "Sao Thổ"
    },
    correctOption: "B",
    explanation: "Sao Hỏa có màu đỏ đặc trưng do các khoáng vật chứa oxit sắt trên bề mặt.",
    timeLimit: 15,
    difficulty: "Dễ"
  },
  {
    id: 5,
    question: "Một hình vuông có cạnh dài 6 cm. Chu vi của hình vuông là bao nhiêu?",
    options: {
      A: "24 cm",
      B: "12 cm",
      C: "36 cm",
      D: "18 cm"
    },
    correctOption: "A",
    explanation: "Chu vi hình vuông bằng độ dài một cạnh nhân 4: 6 × 4 = 24 cm.",
    timeLimit: 15,
    difficulty: "Dễ"
  },
  {
    id: 6,
    question: "Khi AI đưa ra một thông tin để sử dụng trong bài học, việc nào phù hợp nhất trước khi sử dụng?",
    options: {
      A: "Tin ngay vì câu trả lời rất tự tin",
      B: "Chỉ sửa lại cách diễn đạt",
      C: "Kiểm tra và đối chiếu với nguồn đáng tin cậy",
      D: "Chia sẻ ngay để nhiều người cùng đọc"
    },
    correctOption: "C",
    explanation: "AI có thể đưa ra thông tin sai hoặc nguồn không tồn tại, vì vậy cần kiểm chứng trước khi sử dụng.",
    timeLimit: 15,
    difficulty: "Trung bình"
  },
  {
    id: 7,
    question: "Ký hiệu hóa học “O” đại diện cho nguyên tố nào?",
    options: {
      A: "Oxi",
      B: "Hiđro",
      C: "Cacbon",
      D: "Nitơ"
    },
    correctOption: "A",
    explanation: "O là ký hiệu của nguyên tố oxi; H là hiđro, C là cacbon và N là nitơ.",
    timeLimit: 15,
    difficulty: "Trung bình"
  },
  {
    id: 8,
    question: "Từ nào sau đây là từ láy?",
    options: {
      A: "Học sinh",
      B: "Thầy cô",
      C: "Bàn ghế",
      D: "Lấp lánh"
    },
    correctOption: "D",
    explanation: "“Lấp lánh” là từ láy có sự lặp lại phụ âm đầu “l”.",
    timeLimit: 15,
    difficulty: "Trung bình"
  },
  {
    id: 9,
    question: "Một hình chữ nhật có chu vi 30 cm và chiều dài 9 cm. Chiều rộng là bao nhiêu?",
    options: {
      A: "5 cm",
      B: "6 cm",
      C: "7 cm",
      D: "12 cm"
    },
    correctOption: "B",
    explanation: "Tổng chiều dài và chiều rộng là 30 ÷ 2 = 15 cm. Chiều rộng là 15 - 9 = 6 cm.",
    timeLimit: 15,
    difficulty: "Trung bình"
  },
  {
    id: 10,
    question: "Trung bình cộng của bốn số 6, 7, 8 và 9 là bao nhiêu?",
    options: {
      A: "6,5",
      B: "7",
      C: "7,5",
      D: "8"
    },
    correctOption: "C",
    explanation: "Trung bình cộng bằng (6 + 7 + 8 + 9) ÷ 4 = 7,5.",
    timeLimit: 15,
    difficulty: "Trung bình"
  },
  {
    id: 11,
    question: "Gieo một con xúc xắc cân đối có sáu mặt được đánh số từ 1 đến 6. Xác suất xuất hiện số chia hết cho 3 là bao nhiêu?",
    options: {
      A: "1/2",
      B: "1/6",
      C: "2/3",
      D: "1/3"
    },
    correctOption: "D",
    explanation: "Có hai kết quả phù hợp là 3 và 6 trong sáu kết quả có khả năng xuất hiện như nhau, nên xác suất là 2/6 = 1/3.",
    timeLimit: 15,
    difficulty: "Khó"
  },
  {
    id: 12,
    question: "Một lớp có 36 học sinh. Tỉ lệ số học sinh nam và nữ là 4 : 5. Lớp có bao nhiêu học sinh nữ?",
    options: {
      A: "16",
      B: "18",
      C: "24",
      D: "20"
    },
    correctOption: "D",
    explanation: "Tổng số phần là 4 + 5 = 9. Mỗi phần có 36 ÷ 9 = 4 học sinh. Số học sinh nữ là 5 × 4 = 20.",
    timeLimit: 15,
    difficulty: "Khó"
  },
  {
    id: 13,
    question: "Tổng của năm số nguyên liên tiếp bằng 110. Số lớn nhất trong năm số đó là bao nhiêu?",
    options: {
      A: "22",
      B: "24",
      C: "25",
      D: "26"
    },
    correctOption: "B",
    explanation: "Số ở giữa là 110 ÷ 5 = 22. Năm số là 20, 21, 22, 23, 24 nên số lớn nhất là 24.",
    timeLimit: 15,
    difficulty: "Khó"
  },
  {
    id: 14,
    question: "Một lớp có 40 học sinh: 25 bạn thích bóng đá, 20 bạn thích bóng rổ và 5 bạn không thích cả hai môn. Có bao nhiêu bạn thích cả bóng đá lẫn bóng rổ?",
    options: {
      A: "5",
      B: "15",
      C: "10",
      D: "20"
    },
    correctOption: "C",
    explanation: "Có 40 - 5 = 35 bạn thích ít nhất một môn. Số bạn thích cả hai là 25 + 20 - 35 = 10.",
    timeLimit: 15,
    difficulty: "Khó"
  },
  {
    id: 15,
    question: "Có 8 người tham dự một buổi gặp mặt. Mỗi người bắt tay với từng người còn lại đúng một lần. Tổng cộng có bao nhiêu cái bắt tay?",
    options: {
      A: "28",
      B: "32",
      C: "56",
      D: "64"
    },
    correctOption: "A",
    explanation: "Có 8 × 7 lượt tính theo từng người, nhưng mỗi cái bắt tay bị tính hai lần. Tổng số là 8 × 7 ÷ 2 = 28.",
    timeLimit: 15,
    difficulty: "Khó"
  }
];
