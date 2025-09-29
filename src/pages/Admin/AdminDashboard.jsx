import React, { useEffect, useState } from "react";
import axios from 'axios';

const CATEGORIES = [
  { value: "LANDSCAPE", label: "풍경 촬영" },
  { value: "PRODUCT", label: "제품 촬영" },
  { value: "FOOD", label: "음식 촬영" },
  { value: "WEDDING", label: "웨딩 촬영" },
  { value: "REPRESENTATIVE", label: "전체 대표 사진" },
  { value: "LANDSCAPE_MAIN", label: "풍경 대표 사진" },
  { value: "PRODUCT_MAIN", label: "제품 대표 사진" },
  { value: "FOOD_MAIN", label: "음식 대표 사진" },
  { value: "WEDDING_MAIN", label: "웨딩 대표 사진" },
];

// 서버 DTO 키 정규화
const toUrl = (row) => row?.imageUrl || row?.url || row?.image || "";
const withOrigin = (u) => u || ""; 

export default function AdminDashboard() {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const fetchList = async (cat) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/photo", { params: { category: cat } });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("목록 조회 실패:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(category);
  }, [category]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("파일을 선택해 주세요.");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        setSubmitting(false);
        return;
      }

      // --- 백엔드에 Signed URL 요청 ---
      const { data: presignedData } = await axios.post("/api/admin/photo/generate-signed-url", {
        fileName: file.name,
        contentType: file.type
      }, { headers: { Authorization: `Bearer ${token}` } });

      // --- 발급받은 URL로 GCS에 직접 파일 업로드 ---
      await axios.put(presignedData.signedUrl, file, {
        headers: { 'Content-Type': file.type }
      });

      // --- 업로드 완료 후, 파일 메타데이터를 백엔드 DB에 저장 요청 ---
      await axios.post("/api/admin/photo/save-metadata", {
        category: category,
        originalFileName: file.name,
        savedFileName: presignedData.savedFileName
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert("사진이 업로드 되었습니다.");
      setFile(null);
      setPreview("");
      fetchList(category);

    } catch (err) {
      console.error("업로드 실패:", err);
      const errorMsg = err.response?.data?.message || "업로드 중 오류가 발생했습니다.";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm("해당 사진을 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/admin/photo/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((list) => list.filter((it) => it.id !== photoId));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "삭제 실패";
      alert(msg);
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div className="px-6 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-2">관리자 페이지</h1>
      <p className="text-sm text-gray-600 mb-6">사진 업로드 및 관리</p>

      {/* 업로드 폼 */}
      <form onSubmit={handleUpload} className="space-y-4 mb-10">
        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">이미지 파일</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>

        {preview && (
          <div className="mt-2">
            <img src={preview} alt="미리보기" className="max-h-64 rounded" />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "업로드 중..." : "업로드"}
        </button>
      </form>

      {/* 목록/삭제 */}
      <section>
        <h2 className="text-lg font-bold mb-3">등록된 사진</h2>
        {loading ? (
          <p className="text-sm text-gray-500">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">이미지가 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {items.map((it, idx) => {
              const src = withOrigin(toUrl(it));
              return (
                <li key={it.id ?? it.savedFileName ?? idx} className="border rounded p-2">
                  <img
                    src={src}
                    alt={`photo-${it.id ?? idx}`}
                    className="w-full aspect-square object-cover rounded mb-2"
                    onError={(e) => {
                      console.error("[IMG err]", src);
                      e.currentTarget.style.opacity = 0.3;
                    }}
                  />
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="w-full border border-black py-2 text-sm rounded"
                    disabled={!it.id}
                  >
                    삭제
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}