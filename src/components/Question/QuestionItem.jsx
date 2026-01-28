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

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/questions/${item.id}`);
      alert("삭제되었습니다.");
      onChanged();
    } catch (e) {
      alert(e.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    nav(`/question/edit/${currentItem.id}`, { state: { item: currentItem } });
  };

  return (
    <li className="question-item-container border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden">
      <div 
        className="question-summary cursor-pointer p-4 flex items-center gap-4
                   bg-white dark:bg-zinc-800 
                   hover:bg-gray-50 dark:hover:bg-zinc-700" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span 
          className={`status ${currentItem.answered ? "answered" : ""}
                     text-xs font-semibold px-2 py-1 rounded
                     dark:text-zinc-100
                     ${currentItem.answered ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-200 dark:bg-zinc-600"}`}
        >
          {currentItem.answered ? "답변 완료" : "답변 대기"}
        </span>
        <span className="title flex-1 font-semibold truncate dark:text-zinc-100">{currentItem.title}</span>
        <span className="author text-sm text-gray-600 dark:text-zinc-400">{maskName(currentItem.memberName)}</span>
        <span className="date text-sm text-gray-500 dark:text-zinc-500">{formatDate(currentItem.createdAt)}</span>
      </div>

      {isOpen && (
        <div className="question-detail bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700">
          <div className="content-wrapper p-4">
            <p className="question-content whitespace-pre-wrap dark:text-zinc-200">{currentItem.content}</p>

            {isOwner && !isAdmin && (
              <div className="actions flex justify-center mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
                <button onClick={handleEdit} className="text-sm text-gray-600 dark:text-zinc-400 hover:underline">수정</button>
                <button onClick={handleDelete} className="text-sm delete text-red-600 dark:text-red-500 hover:underline ml-2">삭제</button>
              </div>
            )}
            
            {currentItem.answered && currentItem.answer && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-4 rounded">
                <div className="flex items-center gap-3 text-sm mb-2">
                  <span className="font-bold dark:text-zinc-100">PIXO</span>
                  <span className="text-gray-500 dark:text-zinc-400">{formatDate(currentItem.answer.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800 dark:text-zinc-200">{currentItem.answer.content}</p>
              </div>
            )}

            {isAdmin && (
              <>
                <div className="actions my-4 pt-4 border-t border-gray-100 dark:border-zinc-700 text-right">
                  <span className="text-sm text-gray-500 dark:text-zinc-500 mr-2">[관리자 권한] 사용자의 위 게시물</span>
                  <button onClick={handleEdit} className="text-sm text-gray-600 dark:text-zinc-400 hover:underline">수정</button>
                  <button onClick={handleDelete} className="text-sm delete text-red-600 dark:text-red-500 hover:underline ml-2">삭제</button>
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