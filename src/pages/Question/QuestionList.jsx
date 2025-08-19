// src/pages/Question/QuestionList.jsx (수정)

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import QuestionItem from "../../components/Question/QuestionItem";
import SearchBar from "../../components/Question/SearchBar";

export default function QuestionList() {
  const nav = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const isAuthed = !!token;

  // 👇 역할(role)에 따라 관리자 여부를 판단하는 로직은 그대로 유지합니다.
  const isAdmin = useMemo(() => {
    return role && role.toUpperCase().includes('ADMIN');
  }, [role]);

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
      // 👇 관리자가 아닐 때만 '내 문의만 보기'가 동작하도록 수정
      const url = mineOnly && !isAdmin ? "/api/question/my" : "/api/question";
      const config = mineOnly && !isAdmin
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const { data } = await axios.get(url, config);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("문의 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 👇 관리자일 경우, '내 문의만 보기' 상태가 바뀌어도 전체 목록을 다시 불러오도록 보완
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
      const url =
        mode === "title"
          ? "/api/question/search/title"
          : "/api/question/search/content";
      const { data } = await axios.get(url, { params: { keyword: q.trim() } });
      setItems(Array.isArray(data) ? data : []);
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
      {/* =============================================================== */}
      {/* CSS 스타일: 요청사항을 반영하여 수정했습니다.                   */}
      {/* =============================================================== */}
      <style>{`
        .question-list-container {
          padding: 1rem 1rem 4rem; /* 좌우 여백 조정 */
          max-width: 42rem; /* 672px, 너비 재조정 */
          margin: 0 auto;
        }
        
        /* 헤더, 요약, 상세 보기의 Grid 레이아웃을 모두 통일하여 정렬을 맞춥니다. */
        .question-header,
        .question-summary,
        .question-detail {
          display: grid;
          grid-template-columns: 95px 1fr 55px 75px;
          align-items: center;
          gap: 1rem; /* 16px, 간격 조정 */
          padding: 0.75rem 0; /* 좌우 패딩 제거 */
        }

        .question-header {
          font-weight: bold;
          border-bottom: 2px solid #333;
          cursor: default;
        }

        /* ▼▼▼▼▼ 요청사항 반영: 헤더 정렬 수정 ▼▼▼▼▼ */
        .question-header > div {
          text-align: center; /* 제목, 작성자는 중앙 정렬 */
        }
        .question-header > div:nth-child(1) { /* 답변 상태 헤더 */
          text-align: left;
          padding-left: 0.8rem;
        }
        .question-header > div:nth-child(4) { /* 작성일 헤더 */
          text-align: right;
          padding-right: 0.8rem;
        }
        /* ▲▲▲▲▲ 요청사항 반영: 헤더 정렬 수정 ▲▲▲▲▲ */
        
        .question-summary .title {
         text-align: left;
        }

        .question-summary {
          text-align: center;
          cursor: pointer;
        }
        
        /* '답변 대기' 같은 상태 표시에 대한 스타일 추가 */
        .question-summary .status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px; /* fully rounded */
          font-size: 0.875rem;
          font-weight: 500;
          background-color: #e5e7eb; /* gray-200 */
          color: #4b5563; /* gray-600 */
        }

        .question-summary .status.answered {
          background-color: #d1fae5; /* green-100 */
          color: #065f46; /* green-800 */
        }

        .question-summary .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .question-item-container {
          border-bottom: 1px solid #e5e7eb; /* gray-200 */
        }
        
        /* 확장되었을 때 보이는 상세 내용 부분 */
        .question-detail {
          padding: 1rem 0;
          background-color: #f9fafb; /* gray-50 */
        }

        .question-detail .content-wrapper {
          grid-column: 2 / 5; /* 2번째 칸부터 끝(5번째 칸 이전)까지 차지하도록 설정 */
          text-align: left;
          padding-top: 0.5rem;
        }

        .question-content {
          margin-bottom: 1rem;
          white-space: pre-wrap; /* 줄바꿈과 공백을 그대로 표시 */
          word-break: break-all; /* 긴 단어가 영역을 벗어나지 않도록 줄바꿈 */
        }
        
        .actions button {
          padding: 0.25rem 0.75rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.25rem;
          background-color: white;
          margin-right: 0.5rem;
          font-size: 0.875rem;
        }
        .actions button.delete {
          color: #ef4444; /* red-500 */
        }
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
                  <button
                    type="button"
                    onClick={() => setMineOnly((v) => !v)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      mineOnly ? "bg-black" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                        mineOnly ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-gray-500">{mineOnly ? "ON" : "OFF"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => nav("/question/new")}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-black text-white"
                >
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
                mineOnly={!isAdmin && mineOnly}
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
