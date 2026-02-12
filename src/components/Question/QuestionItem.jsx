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
    nav(`/questions/edit/${currentItem.id}`, { state: { item: currentItem } });
  };

  return (
    <li className="question-item-container border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
      <div 
        className="question-summary cursor-pointer p-4 grid grid-cols-[80px_1fr_95px_70px] gap-2 items-start
                   bg-white dark:bg-zinc-800 
                   hover:bg-gray-50 dark:hover:bg-zinc-700" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 답변 상태 */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 mb-1">답변 상태</span>
          <span 
            className={`text-[11px] font-bold px-2 py-0.5 rounded
                       ${currentItem.answered ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-200 dark:bg-zinc-600 dark:text-zinc-100"}`}
          >
            {currentItem.answered ? "완료" : "대기"}
          </span>
        </div>

        {/* 제목 */}
        <div className="flex flex-col px-2">
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 mb-1 text-center">제목</span>
          <span className="title font-semibold truncate dark:text-zinc-100 text-sm">{currentItem.title}</span>
        </div>

        {/* 작성일 (위치 이동 및 너비 확보) */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 mb-1">작성일</span>
          <span className="date text-[12px] text-gray-500 dark:text-zinc-400 whitespace-nowrap">{formatDate(currentItem.createdAt)}</span>
        </div>

        {/* 작성자 */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 mb-1">작성자</span>
          <span className="author text-[12px] text-gray-600 dark:text-zinc-400">{maskName(currentItem.memberName)}</span>
        </div>
      </div>

      {isOpen && (
        <div className="question-detail bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
          <div className="content-wrapper p-5">
            <p className="question-content text-sm whitespace-pre-wrap dark:text-zinc-200 leading-relaxed">{currentItem.content}</p>

            {isOwner && !isAdmin && (
              <div className="actions flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <button onClick={handleEdit} className="text-xs text-gray-500 dark:text-zinc-400 hover:underline">수정</button>
                <button onClick={handleDelete} className="text-xs text-red-600 dark:text-red-500 hover:underline ml-3">삭제</button>
              </div>
            )}
            
            {currentItem.answered && currentItem.answer && (
              <div className="mt-5 pt-5 border-t border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="font-bold dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded">PIXO 답변</span>
                  <span className="text-gray-500 dark:text-zinc-500">{formatDate(currentItem.answer.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 p-3 rounded border border-gray-100 dark:border-zinc-700">{currentItem.answer.content}</p>
              </div>
            )}

            {isAdmin && (
              <>
                <div className="actions my-4 pt-4 border-t border-gray-200 dark:border-zinc-800 text-right">
                  <span className="text-xs text-gray-500 dark:text-zinc-500 mr-2">[관리자 모드]</span>
                  <button onClick={handleEdit} className="text-xs text-gray-600 dark:text-zinc-400 hover:underline">수정</button>
                  <button onClick={handleDelete} className="text-xs text-red-600 dark:text-red-500 hover:underline ml-3">삭제</button>
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