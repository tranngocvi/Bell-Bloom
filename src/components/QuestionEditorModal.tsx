import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Question, OptionKey, DifficultyLevel } from '../types/quiz';

interface QuestionEditorModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  question,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setFormData(JSON.parse(JSON.stringify(question)));
      setError(null);
    }
  }, [question, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }
    if (!formData.options.A.trim() || !formData.options.B.trim() || !formData.options.C.trim() || !formData.options.D.trim()) {
      setError('Cần điền đầy đủ cả 4 phương án A, B, C, D.');
      return;
    }
    if (formData.timeLimit < 5 || formData.timeLimit > 300) {
      setError('Thời gian trả lời phải từ 5 đến 300 giây.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border-4 border-blue-200 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#084DB8] text-white flex items-center justify-center font-black text-sm">
              #{formData.id}
            </span>
            <h3 className="text-2xl font-black text-[#084DB8]">
              Chỉnh sửa Câu số {formData.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Nội dung câu hỏi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 font-semibold"
              placeholder="Nhập nội dung câu hỏi..."
              required
            />
          </div>

          {/* 4 Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(['A', 'B', 'C', 'D'] as OptionKey[]).map((key) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Phương án {key} <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {key}
                  </span>
                  <input
                    type="text"
                    value={formData.options[key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: { ...formData.options, [key]: e.target.value }
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Correct Option & Time & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đáp án đúng <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.correctOption}
                onChange={(e) => setFormData({ ...formData, correctOption: e.target.value as OptionKey })}
                className="w-full px-3 py-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 text-emerald-900 font-black text-sm outline-none"
              >
                <option value="A">Phương án A</option>
                <option value="B">Phương án B</option>
                <option value="C">Phương án C</option>
                <option value="D">Phương án D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thời gian (giây) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mức độ
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-bold outline-none"
              >
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
              </select>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Giải thích đáp án
            </label>
            <textarea
              rows={2}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-slate-700 text-sm font-medium"
              placeholder="Lời giải thích ngắn gọn khi công bố đáp án..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#084DB8] hover:bg-blue-800 text-white font-black rounded-xl shadow-md transition text-sm hover:scale-105 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
