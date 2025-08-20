import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AnswerForm from '../Admin/AnswerForm'; 

const maskName = (name) => {
  if (!name || name.length < 2) return name;
  if (name.length === 2) return `${name.slice(0, 1)}*`;
  return `${name.slice(0, 1)}${'*'.repeat(name.length - 2)}${name.slice(-1)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export default function QuestionItem({ item, isAdmin, onChanged }) {
  const nav = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);

  const loggedInUserName = localStorage.getItem("name");
  const isOwner = loggedInUserName === currentItem.memberName;

  useEffect(() => {
    setCurrentItem(item);
  }, [item]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("정말로 이 문의를 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/question/${currentItem.id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("삭제되었습니다.");
      onChanged?.();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    nav(`/question/edit/${currentItem.id}`, { state: { item: currentItem } });
  };

  return (
    <li className="question-item-container">
      <div className="question-summary" onClick={() => setIsOpen(!isOpen)}>
        <span className={`status ${currentItem.answered ? "answered" : ""}`}>
          {currentItem.answered ? "답변 완료" : "답변 대기"}
        </span>
        <span className="title">{currentItem.title}</span>
        <span className="author">{maskName(currentItem.memberName)}</span>
        <span className="date">{formatDate(currentItem.createdAt)}</span>
      </div>

      {isOpen && (
        <div className="question-detail">
          <div className="content-wrapper">
            <p className="question-content">{currentItem.content}</p>

            {isOwner && !isAdmin && (
              <div className="actions flex justify-center mt-2">
                <button onClick={handleEdit} className="text-sm">수정</button>
                <button onClick={handleDelete} className="text-sm delete ml-2">삭제</button>
              </div>
            )}
            
            {currentItem.answered && currentItem.answer && (
              <div className="mt-4 pt-4 border-t bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-3 text-sm mb-2">
                  <span className="font-bold">PIXO</span>
                  <span className="text-gray-500">{formatDate(currentItem.answer.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800">{currentItem.answer.content}</p>
              </div>
            )}

            {isAdmin && (
              <>
                <div className="actions my-4 text-right">
                  <span className="text-sm text-gray-500 mr-2">[관리자 권한] 사용자의 위 게시물</span>
                  <button onClick={handleEdit}>수정</button>
                  <button onClick={handleDelete} className="delete">삭제</button>
                </div>
                <AnswerForm
                  key={currentItem.id}
                  questionId={currentItem.id}
                  existingAnswer={currentItem.answer}
                  onAnswered={onChanged}
                />
              </>
            )}
          </div>
        </div>
      )}
    </li>
  );
}