import { Question } from '../types/quiz';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    "id": 1,
    "question": "Tòa nhà FPT Polytechnic Đà Nẵng có tổng hết bao nhiêu tầng?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "10 tầng",
      "B": "11 tầng",
      "C": "12 tầng",
      "D": "13 tầng"
    },
    "correctOption": "D",
    "correctAnswerText": "13 tầng",
    "explanation": "Đáp án chính xác là D: 13 tầng",
    "timeLimit": 15,
    "difficulty": "Dễ"
  },
  {
    "id": 2,
    "question": "Địa chỉ trường FPT PolySchool cơ sở Đà Nẵng ở đâu?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "137 Nguyễn Thị Thập, Hòa Minh, Đà Nẵng",
      "B": "137 Nguyễn Thị Thập, Thanh Khê, Đà Nẵng",
      "C": "137 Nguyễn Thị Thập, Thanh Khê Tây, Đà Nẵng",
      "D": "137 Nguyễn Thị Thập, Hòa Khánh, Đà Nẵng"
    },
    "correctOption": "B",
    "correctAnswerText": "137 Nguyễn Thị Thập, Thanh Khê, Đà Nẵng",
    "explanation": "Đáp án chính xác là B: 137 Nguyễn Thị Thập, Thanh Khê, Đà Nẵng",
    "timeLimit": 15,
    "difficulty": "Dễ"
  },
  {
    "id": 3,
    "question": "Muốn mượn cơ sở vật chất, phòng học, em đến đâu?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "Phòng Đào tạo",
      "B": "Phòng hành chính",
      "C": "Phòng dịch vụ sinh viên",
      "D": "Phòng bảo vệ"
    },
    "correctOption": "B",
    "correctAnswerText": "Phòng hành chính",
    "explanation": "Đáp án chính xác là B: Phòng hành chính",
    "timeLimit": 15,
    "difficulty": "Dễ"
  },
  {
    "id": 4,
    "question": "Hệ thống xác nhận điểm của SV là hệ thống gì?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "E360",
      "B": "F360",
      "C": "E365",
      "D": "F365"
    },
    "correctOption": "A",
    "correctAnswerText": "E360",
    "explanation": "Đáp án chính xác là A: E360",
    "timeLimit": 15,
    "difficulty": "Dễ"
  },
  {
    "id": 5,
    "question": "Phòng CoachingRoom của trường ở đâu và thầy cô nào đảm nhận chính?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "P408 - Cô Nguyễn Hoàng Giang",
      "B": "P408 - Thầy Nguyễn Văn Vũ",
      "C": "P205 - Cô Nguyễn Hoàng Giang",
      "D": "P205 - Thầy Lê Xuân Hoàng"
    },
    "correctOption": "B",
    "correctAnswerText": "P408 - Thầy Nguyễn Văn Vũ",
    "explanation": "Đáp án chính xác là B: P408 - Thầy Nguyễn Văn Vũ",
    "timeLimit": 15,
    "difficulty": "Dễ"
  },
  {
    "id": 6,
    "question": "Câu hỏi hình ảnh: Đây là hình ảnh được xuất hiện tại sự kiện nào tại FPS ĐN?",
    "type": "multiple_choice",
    "imageUrl": "/cau6-hinh-anh.png",
    "options": {
      "A": "Thiện nguyện trung thu",
      "B": "Lễ tôn vinh - Trung thu cho em",
      "C": "Lễ tôn vinh - Đêm hội trăng rằm",
      "D": "Tết trung thu"
    },
    "correctOption": "C",
    "correctAnswerText": "Lễ tôn vinh - Đêm hội trăng rằm",
    "explanation": "Đáp án chính xác là C: Lễ tôn vinh - Đêm hội trăng rằm",
    "timeLimit": 15,
    "difficulty": "Trung bình"
  },
  {
    "id": 7,
    "question": "Câu hỏi hình ảnh: Đây là thầy/cô nào?",
    "type": "multiple_choice",
    "imageUrl": "/cau7-hinh-anh.png",
    "options": {
      "A": "Thầy Nguyễn Văn Vũ",
      "B": "Thầy Trần Ngọc Vĩ",
      "C": "Thầy Nguyễn Thành Đạt",
      "D": "Thầy Lê Công Tú"
    },
    "correctOption": "A",
    "correctAnswerText": "Thầy Nguyễn Văn Vũ",
    "explanation": "Đáp án chính xác là A: Thầy Nguyễn Văn Vũ",
    "timeLimit": 15,
    "difficulty": "Trung bình"
  },
  {
    "id": 8,
    "question": "\"Em kia, vào lớp\" là câu nói của ai hay dùng nhất tại FPS Đà Nẵng?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "Thầy Lê Xuân Hoàng",
      "B": "Cô Bùi Thị Thu Hương",
      "C": "Thầy Trương Tấn Việt",
      "D": "Cô Bùi Thị Băng Lam"
    },
    "correctOption": "C",
    "correctAnswerText": "Thầy Trương Tấn Việt",
    "explanation": "Đáp án chính xác là C: Thầy Trương Tấn Việt",
    "timeLimit": 15,
    "difficulty": "Trung bình"
  },
  {
    "id": 9,
    "question": "SV FPS hay dùng lý do nào nhất khi quên làm bài tập?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "“Em để quên vở ở nhà ạ”",
      "B": "“Em làm rồi nhưng em trai xé mất”",
      "C": "“Em tưởng hôm nay không học môn này”",
      "D": "“Em bị đau bụng từ tối qua đến sáng nay ạ”"
    },
    "correctOption": "D",
    "correctAnswerText": "“Em bị đau bụng từ tối qua đến sáng nay ạ”",
    "explanation": "Đáp án chính xác là D: “Em bị đau bụng từ tối qua đến sáng nay ạ”",
    "timeLimit": 15,
    "difficulty": "Trung bình"
  },
  {
    "id": 10,
    "question": "Thầy Giám đốc điều hành hiện nay của FPT PolySchool Đà Nẵng là ai?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "Thầy Phạm Đình An",
      "B": "Thầy Nguyễn Đình Anh",
      "C": "Thầy Nguyễn Xuân Anh",
      "D": "Thầy Nguyễn Đình An"
    },
    "correctOption": "D",
    "correctAnswerText": "Thầy Nguyễn Đình An",
    "explanation": "Đáp án chính xác là D: Thầy Nguyễn Đình An",
    "timeLimit": 15,
    "difficulty": "Trung bình"
  },
  {
    "id": 11,
    "question": "Khóa sinh viên đầu tiên của FPS Đà Nẵng là khóa bao nhiêu?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "K18",
      "B": "K17",
      "C": "K16",
      "D": "K15"
    },
    "correctOption": "C",
    "correctAnswerText": "K16",
    "explanation": "Đáp án chính xác là C: K16",
    "timeLimit": 15,
    "difficulty": "Khó"
  },
  {
    "id": 12,
    "question": "Tầng 1 là phòng tuyển sinh, tầng 2 có phòng Giám thị/ Dịch vụ SV, tầng 11 có phòng Đào tạo, phòng CTSV,.. vậy phòng GV FPS ở đâu?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "101",
      "B": "205",
      "C": "304",
      "D": "408"
    },
    "correctOption": "B",
    "correctAnswerText": "205",
    "explanation": "Đáp án chính xác là B: 205",
    "timeLimit": 15,
    "difficulty": "Khó"
  },
  {
    "id": 13,
    "question": "Ngày nào cũng vào lớp, nhưng bạn có nhớ chính xác “bộ ba khẩu hiệu” treo trên tường là gì không?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "Học nhanh làm ngay – Kỹ năng tốt – Vững chuyên môn",
      "B": "Học nhanh làm sớm – Kỹ năng giỏi – Vững tay nghề",
      "C": "Học nhanh làm sớm – Kỹ năng tốt – Vững chuyên môn",
      "D": "Học chắc làm sớm – Kỹ năng tốt – Giỏi chuyên môn"
    },
    "correctOption": "C",
    "correctAnswerText": "Học nhanh làm sớm – Kỹ năng tốt – Vững chuyên môn",
    "explanation": "Đáp án chính xác là C: Học nhanh làm sớm – Kỹ năng tốt – Vững chuyên môn",
    "timeLimit": 15,
    "difficulty": "Khó"
  },
  {
    "id": 14,
    "question": "Đâu là cách viết đầy đủ và đúng nhất tên trưởng mình?",
    "type": "multiple_choice",
    "imageUrl": null,
    "options": {
      "A": "FPS",
      "B": "FPT Schools",
      "C": "FPT Polyschool",
      "D": "FPT PolySchool"
    },
    "correctOption": "D",
    "correctAnswerText": "FPT PolySchool",
    "explanation": "Đáp án chính xác là D: FPT PolySchool",
    "timeLimit": 15,
    "difficulty": "Khó"
  },
  {
    "id": 15,
    "question": "Thầy/ cô nào nặng nhất trường mình?",
    "type": "written",
    "imageUrl": null,
    "options": {
      "A": "",
      "B": "",
      "C": "",
      "D": ""
    },
    "correctOption": "A",
    "correctAnswerText": "Thầy Nguyễn Văn Tấn",
    "explanation": "Thầy Nguyễn Văn Tấn là đáp án chính xác cho câu hỏi đặc biệt số 15.",
    "timeLimit": 15,
    "difficulty": "Khó"
  }
];
