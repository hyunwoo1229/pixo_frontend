import React, { useState } from "react"; // useEffect 제거
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
  // currentItem state를 제거하고 부모로부터 받은 item prop을 직접 사용합니다.

  const loggedInUserName = localStorage.getItem("name");
  const isOwner = loggedInUserName === item.memberName;

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
    nav(`/questions/edit/${item.id}`, { state: { item: item } });
  };

  return (
    <li className="question-item-container border-b border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div 
        className="!grid !grid-cols-[100px_1fr_80px_100px] items-center !gap-2 !p-4 cursor-pointer
                   bg-white dark:bg-zinc-800 
                   hover:bg-gray-50 dark:hover:bg-zinc-700" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="!flex !justify-start !pl-1">
          <span 
            className={`status ${item.answered ? "answered" : ""}
                       text-[11px] font-semibold px-2 py-0.5 rounded
                       ${item.answered ? "bg-black text-white dark:bg-white dark:!text-black" : "bg-gray-200 dark:bg-zinc-600 dark:text-zinc-100"}`}
          >
            {item.answered ? "완료" : "대기"}
          </span>
        </div>

        <span className="title font-semibold truncate dark:text-zinc-100 text-sm !text-left">{item.title}</span>
        <span className="author text-sm text-gray-600 dark:text-zinc-400 !text-left">{maskName(item.memberName)}</span>
        <span className="date text-sm text-gray-500 dark:text-zinc-500 !text-left !whitespace-nowrap">{formatDate(item.createdAt)}</span>
      </div>

      {isOpen && (
        <div className="question-detail bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700">
          <div className="content-wrapper p-4">
            <p className="question-content whitespace-pre-wrap dark:text-zinc-200 text-sm">{item.content}</p>

            {isOwner && !isAdmin && (
              <div className="actions flex justify-center mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
                <button onClick={handleEdit} className="text-sm text-gray-600 dark:text-zinc-400 hover:underline">수정</button>
                <button onClick={handleDelete} className="text-sm delete text-red-600 dark:text-red-500 hover:underline ml-2">삭제</button>
              </div>
            )}
            
            {/* 답변이 존재할 때만 표시 (answered 여부와 상관없이 answer 객체가 있으면 보여주도록 수정) */}
            {item.answer && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-4 rounded text-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold dark:text-zinc-100">PIXO 답변</span>
                  <span className="text-gray-500 dark:text-zinc-400 text-xs">{formatDate(item.answer.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800 dark:text-zinc-200">{item.answer.content}</p>
              </div>
            )}

            {isAdmin && (
              <>
                <div className="actions my-4 pt-4 border-t border-gray-100 dark:border-zinc-700 text-right">
                  <span className="text-sm text-gray-500 dark:text-zinc-500 mr-2">[관리자 권한]</span>
                  <button onClick={handleEdit} className="text-sm text-gray-600 dark:text-zinc-400 hover:underline">수정</button>
                  <button onClick={handleDelete} className="text-sm delete text-red-600 dark:text-red-500 hover:underline ml-2">삭제</button>
                </div>
                {/* 최신 item.answer를 prop으로 직접 넘깁니다. */}
                <AnswerForm
                  key={item.id}
                  questionId={item.id}
                  existingAnswer={item.answer}
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