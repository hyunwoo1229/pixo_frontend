import React, { useState } from "react";
import axios from 'axios'

export default function AnswerForm({ questionId, existingAnswer, onAnswered }) {
  const [content, setContent] = useState(existingAnswer?.content || '')
  const [isEditing, setIsEditing] = useState(!!existingAnswer)
  const [submitting, setSubmitting] = useState(false)
  const token = localStorage.getItem('accessToken')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('답변 내용을 입력해주세요.')
      return
    }
    setSubmitting(true)
    try {
      const payload = { content: content.trim() }
      if (isEditing) {
        // 답변 수정
        await axios.put(
          `/api/admin/question/answer/${existingAnswer.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        alert('답변이 수정되었습니다.')
      } else {
        // 새 답변 등록
        await axios.post(
          `/api/admin/question/${questionId}/answer`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        alert('답변이 등록되었습니다.')
      }
      onAnswered() // 목록 새로고침
    } catch (err) {
      console.error(err)
      alert('처리 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('답변을 삭제하시겠습니까?')) return
    setSubmitting(true)
    try {
      await axios.delete(`/api/admin/question/answer/${existingAnswer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('답변이 삭제되었습니다.')
      setContent('')
      setIsEditing(false)
      onAnswered()
    } catch (err) {
      console.error(err)
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답변을 입력하세요..."
        className="w-full border rounded p-2 min-h-[120px]"
        disabled={submitting}
      />
      <div className="flex justify-end gap-2 mt-2">
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm border rounded"
            disabled={submitting}
          >
            삭제
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-black text-white rounded"
          disabled={submitting}
        >
          {isEditing ? '수정' : '답변 등록'}
        </button>
      </div>
    </form>
  )
}