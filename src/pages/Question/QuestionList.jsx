import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import QuestionItem from "../../components/Question/QuestionItem";
import SearchBar from "../../components/Question/SearchBar";

export default function QuestionList({ isAdmin = false }) {
  const nav = useNavigate();
  const token = localStorage.getItem("accessToken");
  const isAuthed = !!token;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mineOnly, setMineOnly] = useState(false);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("title");

  useEffect(() => {
    if (!isAuthed && mineOnly) setMineOnly(false);
  }, [isAuthed, mineOnly]);

  useEffect(() => {
    fetchList();
  }, [mineOnly, isAdmin]);
  
  async function fetchList() {
    try {
      setLoading(true);
      const url = mineOnly && !isAdmin ? "/api/questions/me" : "/api/questions";
      const { data } = await axios.get(url);
      
      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sortedData);
      }
    } catch (e) {
      console.error(e);
      alert("문의 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSearch() {
    if (!q.trim()) {
      fetchList();
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get("/api/questions/search", { 
        params: { type: mode, keyword: q.trim() } 
      });
      
      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sortedData);
      }
    } catch (e) {
      console.error(e);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-16">
      <h1 className="text-center text-xl font-extrabold mb-9 dark:text-zinc-100">
        {isAdmin ? "1:1 문의 관리" : "1:1 문의"}
      </h1>
      
      {!isAdmin && (
        <div className="flex items-center justify-between mb-3">
          {isAuthed ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-zinc-400">내 문의만 보기</span>
                <button 
                  type="button" 
                  onClick={() => setMineOnly((v) => !v)} 
                  className={`w-12 h-6 rounded-full transition-colors relative 
                             ${mineOnly ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-zinc-600"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all 
                                 ${mineOnly ? "right-0.5 dark:bg-zinc-900" : "left-0.5"}`} />
                </button>
                <span className="text-xs text-gray-500 dark:text-zinc-500">{mineOnly ? "ON" : "OFF"}</span>
              </div>
              <button 
                type="button" 
                onClick={() => nav("/questions/new")} 
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded 
                           bg-black text-white 
                           dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                + 작성하기
              </button>
            </>
          ) : ( <div /> )}
        </div>
      )}
      
      <div className="!grid !grid-cols-[100px_1fr_80px_100px] items-center !gap-2 py-3 
                      font-bold border-b-2 border-black dark:border-zinc-400 text-sm">
        <div className="!text-left !pl-4">답변 상태</div>
        <div className="!text-center">제목</div>
        <div className="!text-left !-ml-5">작성자</div>
        <div className="!text-left">작성일</div>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-zinc-400 py-6 text-center">불러오는 중…</p>
      ) : empty ? (
        <p className="text-gray-500 dark:text-zinc-400 py-6 text-center">문의가 없습니다.</p>
      ) : (
        <ul>
          {items.map((it) => (
            <QuestionItem
              key={it.id}
              item={it}
              isAdmin={isAdmin}
              onChanged={fetchList}
            />
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-gray-200 dark:border-zinc-700 pt-3">
        <SearchBar
          mode={mode}
          onModeChange={setMode}
          value={q}
          onChange={setQ}
          onSearch={handleSearch}
          placeholder="검색어를 입력하세요"
        />
      </div>
    </div>
  );
}