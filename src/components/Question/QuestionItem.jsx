import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AnswerForm from '../Admin/AnswerForm' 

const maskName = (name) => {
  if (!name || name.length < 2) return name
  if (name.length === 2) return `${name[0]}*`
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export default function QuestionItem({ item, mineOnly, isAdmin, onChanged }) {
  const nav = useNavigate()
  const token = localStorage.getItem('accessToken')
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('정말로 이 문의를 삭제하시겠습니까?')) return
    try {
      await axios.delete(`/api/question/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('삭제되었습니다.')
      onChanged?.()
    } catch (err) {
      console.error(err)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    nav(`/question/edit/${item.id}`, { state: { item } })
  }

  return (
    <li className="question-item-container">
      <div className="question-summary" onClick={() => setIsOpen(!isOpen)}>
        <span className={`status ${item.answered ? 'answered' : ''}`}>
          {item.answered ? '답변 완료' : '답변 대기'}
        </span>
        <span className="title">{item.title}</span>
        <span className="author">{maskName(item.memberName)}</span>
        <span className="date">{formatDate(item.createdAt)}</span>
      </div>

      {isOpen && (
        <div className="question-detail">
          <div className="content-wrapper">
            <p className="question-content">{item.content}</p>

            {item.answered && item.answer && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-4 text-sm mb-2">
                  <span className="font-bold">PIXO</span>
                  <span className="text-gray-500">
                    {formatDate(item.answer.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{item.answer.content}</p>
              </div>
            )}

            {isAdmin && (
              <AnswerForm
                questionId={item.id}
                existingAnswer={item.answer}
                onAnswered={onChanged}
              />
            )}

            {mineOnly && !isAdmin && (
              <div className="actions">
                <button onClick={handleEdit}>수정</button>
                <button onClick={handleDelete} className="delete">
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}