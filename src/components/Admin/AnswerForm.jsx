import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AnswerForm({ questionId, existingAnswer, onAnswered }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("accessToken");

  // '수정' 모드 여부를 prop에 따라 직접 결정
  const isEditing = !!existingAnswer;

  // prop이 변경될 때마다 content 상태를 동기화
  useEffect(() => {
    setContent(existingAnswer?.content || '');
  }, [existingAnswer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    
    try {
      const payload = { content: content.trim() };
      if (isEditing) {
        await axios.patch(`/api/admin/questions/answers/${existingAnswer.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('답변이 수정되었습니다.');
      } else {
        await axios.post(`/api/admin/questions/${questionId}/answers`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('답변이 등록되었습니다.');
      }
      onAnswered();
    } catch (err) {
      console.error(err);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('답변을 삭제하시겠습니까?')) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/admin/questions/answers/${existingAnswer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('답변이 삭제되었습니다.');
      setContent('');
      onAnswered(); 
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답변을 입력하세요..."
        className="w-full border border-gray-300 dark:border-zinc-600 rounded p-2 min-h-[120px] 
                   bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
        disabled={submitting}
      />
      <div className="flex justify-end gap-2 mt-2">
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded 
                       hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
            disabled={submitting}
          >
            삭제
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-black text-white rounded 
                     dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
          disabled={submitting}
        >
          {isEditing ? '수정' : '답변 등록'}
        </button>
      </div>
    </form>
  );
}