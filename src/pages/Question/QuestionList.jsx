import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import QuestionItem from "../../components/Question/QuestionItem";
import SearchBar from "../../components/Question/SearchBar";

// App.jsx로부터 isAdmin prop을 받도록 수정 (기본값 false)
export default function QuestionList({ isAdmin = false }) {
  const nav = useNavigate();
  const location = useLocation();
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

  async function fetchList() {
    try {
      setLoading(true);
      const url = mineOnly && !isAdmin ? "/api/question/my" : "/api/question";
      const config = mineOnly && !isAdmin
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      
      const { data } = await axios.get(url, config);
      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sortedData);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error(e);
      alert("문의 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchList();
    } else if (!mineOnly || isAuthed) {
      fetchList();
    }
  }, [mineOnly, isAuthed, isAdmin]);

  async function handleSearch() {
    if (!q.trim()) {
      fetchList();
      return;
    }
    try {
      setLoading(true);
      const url = mode === "title" ? "/api/question/search/title" : "/api/question/search/content";
      const { data } = await axios.get(url, { params: { keyword: q.trim() } });
      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sortedData);
      } else {
        setItems([]);
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
    <>
      <style>{`
        .question-list-container { padding: 1rem 1rem 4rem; max-width: 42rem; margin: 0 auto; }
        .question-header, .question-summary, .question-detail { display: grid; grid-template-columns: 95px 1fr 55px 75px; align-items: center; gap: 1rem; padding: 0.75rem 0; }
        .question-header { font-weight: bold; border-bottom: 2px solid #333; cursor: default; }
        .question-header > div { text-align: center; }
        .question-header > div:nth-child(1) { text-align: left; padding-left: 0.8rem; }
        .question-header > div:nth-child(4) { text-align: right; padding-right: 0.8rem; }
        .question-summary .title { text-align: left; }
        .question-summary { text-align: center; cursor: pointer; }
        .question-summary .status { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; background-color: #e5e7eb; color: #4b5563; }
        .question-summary .status.answered { background-color: #d1fae5; color: #065f46; }
        .question-summary .title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .question-item-container { border-bottom: 1px solid #e5e7eb; }
        .question-detail { padding: 1rem 0; background-color: #f9fafb; }
        .question-detail .content-wrapper { grid-column: 2 / 5; text-align: left; padding-top: 0.5rem; }
        .question-content { margin-bottom: 1rem; white-space: pre-wrap; word-break: break-all; }
        .actions button { padding: 0.25rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.25rem; background-color: white; margin-right: 0.5rem; font-size: 0.875rem; }
        .actions button.delete { color: #ef4444; }
      `}</style>

      <div className="question-list-container">
        <h1 className="text-center text-xl font-extrabold mb-9">
          {isAdmin ? "1:1 문의 관리" : "1:1 문의"}
        </h1>
        
        {!isAdmin && (
          <div className="flex items-center justify-between mb-3">
            {isAuthed ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">내 문의만 보기</span>
                  {/* ▼▼▼▼▼ [ ✨ 이 부분의 오타를 수정했습니다 ] ▼▼▼▼▼ */}
                  <button type="button" onClick={() => setMineOnly((v) => !v)} className={`w-12 h-6 rounded-full transition-colors relative ${mineOnly ? "bg-black" : "bg-gray-300"}`}>
                  {/* ▲▲▲▲▲ [ ✨ 이 부분의 오타를 수정했습니다 ] ▲▲▲▲▲ */}
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${mineOnly ? "right-0.5" : "left-0.5"}`} />
                  </button>
                  <span className="text-xs text-gray-500">{mineOnly ? "ON" : "OFF"}</span>
                </div>
                <button type="button" onClick={() => nav("/question/new")} className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-black text-white">
                  + 작성하기
                </button>
              </>
            ) : ( <div /> )}
          </div>
        )}
        
        <div className="question-header">
          <div>답변 상태</div>
          <div>제목</div>
          <div>작성자</div>
          <div>작성일</div>
        </div>

        {loading ? (
          <p className="text-gray-500 py-6 text-center">불러오는 중…</p>
        ) : empty ? (
          <p className="text-gray-500 py-6 text-center">문의가 없습니다.</p>
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

        <div className="mt-4 border-t pt-3">
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
    </>
  );
}