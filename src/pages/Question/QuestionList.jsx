import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import QuestionItem from "../../components/Question/QuestionItem";
import SearchBar from "../../components/Question/SearchBar";

export default function QuestionList() {
  const nav = useNavigate();
  const token = localStorage.getItem("accessToken");
  const isAuthed = !!token;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI 상태
  const [mineOnly, setMineOnly] = useState(false);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("title"); // "title" | "content"

  // 로그인 안 된 상태에서 mineOnly가 true가 되지 않도록 보정
  useEffect(() => {
    if (!isAuthed && mineOnly) setMineOnly(false);
  }, [isAuthed, mineOnly]);

  // 목록 조회
  async function fetchList() {
    try {
      setLoading(true);
      const url = mineOnly ? "/api/question/my" : "/api/question";
      const config = mineOnly
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const { data } = await axios.get(url, config);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("문의 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 초기 진입 & mineOnly / 토큰 변경 시
  useEffect(() => {
    if (!mineOnly || isAuthed) fetchList();
  }, [mineOnly, isAuthed]);

  // 검색: 모드에 따라 엔드포인트 분기
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

  // 작성하기 버튼 동작
  function handleClickWrite() {
    if (!isAuthed) {
      alert("로그인이 필요합니다.");
      nav("/login", { state: { from: "/question/new" } });
      return;
    }
    nav("/question/new");
  }

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  return (
    <div className="px-6 pt-4 max-w-md mx-auto">
      {/* 상단 타이틀 */}
      <h1 className="text-center text-xl font-extrabold mb-9">1:1 문의</h1>
{/* 상단 행: (좌) 내 문의만 보기 / (우) 작성하기 — 둘 다 로그인 시에만 표시 */}
<div className="flex items-center justify-between mb-3">
  {isAuthed ? (
    <>
      {/* 내 문의만 보기 토글 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">내 문의만 보기</span>
        <button
          type="button"
          onClick={() => setMineOnly((v) => !v)}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            mineOnly ? "bg-black" : "bg-gray-300"
          }`}
          aria-label="내 문의만 보기"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              mineOnly ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
        <span className="text-xs text-gray-500">{mineOnly ? "ON" : "OFF"}</span>
      </div>

      {/* 작성하기 버튼 */}
      <button
        type="button"
        onClick={() => nav("/question/new")}
        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-black text-white"
      >
        + 작성하기
      </button>
    </>
  ) : (
    <div /> // 비로그인 시에는 양쪽 모두 숨김
  )}
</div>
      {/* 4열 헤더 */}
      <div
        className="grid text-sm border-b border-t py-2"
        style={{
          gridTemplateColumns: "85px 1fr 60px 60px", // 답변상태 | 제목 | 작성자 | 작성일
          columnGap: "8px",
        }}
      >
        <div className="text-gray-600">답변 상태</div>
        <div className="text-gray-600 text-center">제목</div>
        <div className="text-gray-600 text-center">작성자</div>
        <div className="text-gray-600 text-right">작성일</div>
      </div>

      {/* 목록 */}
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
              mineOnly={mineOnly}
              onChanged={fetchList}
            />
          ))}
        </ul>
      )}

      {/* 하단 검색 (드롭다운 + 입력·버튼 결합) */}
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
  );
}
