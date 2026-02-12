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
    <li className="question-item-container border-b border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div 
        className="question-summary cursor-pointer py-4 grid grid-cols-[100px_1fr_80px_100px] items-center gap-2
                   bg-white dark:bg-zinc-800 
                   hover:bg-gray-50 dark:hover:bg-zinc-700" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 답변 상태: pl-4를 주어 아주 조금만 오른쪽으로 이동 */}
        <div className="pl-4">
          <span 
            className={`status ${currentItem.answered ? "answered" : ""}
                       text-[11px] font-semibold px-2 py-0.5 rounded
                       dark:text-zinc-100
                       ${currentItem.answered ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-200 dark:bg-zinc-600"}`}
          >
            {currentItem.answered ? "답변 완료" : "답변 대기"}
          </span>
        </div>
        
        <span className="title font-semibold truncate dark:text-zinc-100 text-sm">{currentItem.title}</span>
        
        {/* 작성자와 작성일: text-left로 훨씬 왼쪽으로 이동 및 정렬 */}
        <span className="author text-sm text-gray-600 dark:text-zinc-400 text-left">{maskName(currentItem.memberName)}</span>
        <span className="date text-sm text-gray-500 dark:text-zinc-500 text-left whitespace-nowrap">{formatDate(currentItem.createdAt)}</span>
      </div>

      {isOpen && (
        <div className="question-detail bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700">
          <div className="content-wrapper p-4">
            <p className="question-content whitespace-pre-wrap dark:text-zinc-200 text-sm">{currentItem.content}</p>

            {isOwner && !isAdmin && (
              <div className="actions flex justify-center mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
                <button onClick={handleEdit} className="text-sm text-gray-600 dark:text-zinc-400 hover:underline">수정</button>
                <button onClick={handleDelete} className="text-sm delete text-red-600 dark:text-red-500 hover:underline ml-2">삭제</button>
              </div>
            )}
            
            {currentItem.answered && currentItem.answer && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-4 rounded text-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold dark:text-zinc-100">PIXO 답변</span>
                  <span className="text-gray-500 dark:text-zinc-400 text-xs">{formatDate(currentItem.answer.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800 dark:text-zinc-200">{currentItem.answer.content}</p>
              </div>
            )}

            {isAdmin && (
              <>
                <div className="actions my-4 pt-4 border-t border-gray-100 dark:border-zinc-700 text-right">
                  <span className="text-sm text-gray-500 dark:text-zinc-500 mr-2">[관리자 권한]</span>
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