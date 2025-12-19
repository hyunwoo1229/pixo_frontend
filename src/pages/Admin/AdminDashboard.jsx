/*
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const CATEGORIES = [
  { value: "REPRESENTATIVE", label: "전체 대표 사진" },
  { value: "WEDDING_MAIN", label: "웨딩 대표 사진" },
  { value: "FASHION_MAIN", label: "패션 대표 사진" },
  { value: "PRODUCT_MAIN", label: "제품 대표 사진" },
  { value: "FOOD_MAIN", label: "음식 대표 사진" },
  { value: "CAR_MAIN", label: "차 대표 사진" },
  { value: "LANDSCAPE_MAIN", label: "풍경 대표 사진" },
  { value: "DRONE_LANDSCAPE_MAIN", label: "드론 풍경 대표 사진" },
  { value: "WEDDING", label: "웨딩 사진" },
  { value: "FASHION", label: "패션 사진" },
  { value: "PRODUCT", label: "제품 사진" },
  { value: "FOOD", label: "음식 사진" },
  { value: "CAR", label: "차 사진" },
  { value: "LANDSCAPE", label: "풍경 사진" },
  { value: "DRONE_LANDSCAPE", label: "드론 풍경 사진" },
];

// 이미지 URL 처리 (null 안전)
const toUrl = (row) => row?.imageUrl || row?.url || row?.image || "";

export default function AdminDashboard() {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [files, setFiles] = useState([]); // 다중 파일 저장을 위한 배열
  const [previews, setPreviews] = useState([]); // 미리보기 URL 배열
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 드래그 앤 드롭을 위한 Ref
  const dragItem = useRef();
  const dragOverItem = useRef();

  // 컴포넌트 언마운트 시 미리보기 URL 메모리 해제
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // 목록 불러오기
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

  // 파일 선택 핸들러 (다중 선택 지원)
  const onFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);

    // 기존 미리보기 제거 후 새로 생성
    previews.forEach(url => URL.revokeObjectURL(url));
    const newPreviews = selectedFiles.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  // 다중 업로드 핸들러
  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("파일을 선택해 주세요.");
    if (files.length > 30) return alert("한 번에 30장까지만 업로드 가능합니다.");

    setSubmitting(true);
    const token = localStorage.getItem("accessToken");

    try {
      
      for (const file of files) {
        
        // --- 1. 압축 로직 ---
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp"
        };

        let compressedFile = file;
        try {
          compressedFile = await imageCompression(file, options);
        } catch (error) {
          console.error("압축 실패, 원본 사용", error);
        }
        
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

        // --- 2. Signed URL 요청 ---
        const { data: presignedData } = await axios.post(
          "/api/admin/photo/generate-signed-url",
          {
            fileName: newFileName,
            contentType: "image/webp", 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // --- 3. GCS 업로드 ---
        await fetch(presignedData.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/webp" },
          body: compressedFile,
        });

        // --- 4. DB 저장
        await axios.post(
          "/api/admin/photo/save-metadata",
          {
            category: category,
            originalFileName: file.name,
            savedFileName: presignedData.savedFileName,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } 

      alert(`${files.length}장 업로드 및 압축 완료`);
      setFiles([]);
      setPreviews([]);
      e.target.reset(); 
      fetchList(category);

    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
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
      alert("삭제 실패");
      console.error(err);
    }
  };

  // --- 드래그 앤 드롭 로직 ---
  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    const copyListItems = [...items];
    const dragItemContent = copyListItems[dragItem.current];
    
    // 배열 내 위치 변경
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    // UI 즉시 업데이트 (사용자 경험 향상)
    setItems(copyListItems);

    // 변경된 순서를 서버에 저장
    try {
        const token = localStorage.getItem("accessToken");
        // 변경된 리스트 순서대로 ID 추출
        const idList = copyListItems.map(item => item.id);
        
        await axios.post("/api/admin/photo/order", idList, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("순서 변경 저장 완료");
    } catch (err) {
        console.error("순서 변경 저장 실패", err);
        alert("순서 변경 저장에 실패했습니다.");
        fetchList(category); // 실패 시 원래 순서로 복구
    }
  };

  return (
    <div className="px-6 py-6 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-2 dark:text-zinc-100">관리자 페이지</h1>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">사진 업로드 및 순서 관리</p>

      <form onSubmit={handleUpload} className="space-y-4 mb-10 border p-4 rounded bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">카테고리</label>
          <select
            className="w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 
                       bg-white dark:bg-zinc-800 dark:text-white
                       focus:ring-2 focus:ring-blue-500 outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">
            이미지 파일 <span className="text-xs text-gray-500">(Shift/Ctrl 키로 여러 장 선택 가능)</span>
          </label>
          <input 
            type="file" 
            accept="image/*" 
            multiple // 다중 파일 선택 허용
            onChange={onFileChange} 
            className="dark:text-zinc-300 w-full"
          />
        </div>

        {previews.length > 0 && (
          <div className="flex gap-3 overflow-x-auto py-2">
            {previews.map((src, i) => (
              <div key={i} className="flex-shrink-0 relative">
                <img src={src} alt="preview" className="h-24 w-24 object-cover rounded border dark:border-zinc-600" />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded disabled:opacity-60
                     dark:bg-white dark:text-black dark:hover:bg-gray-200 font-medium"
          disabled={submitting}
        >
          {submitting ? "업로드 중..." : `${files.length > 0 ? files.length + '장 ' : ''}업로드`}
        </button>
      </form>

      <section>
        <div className="flex items-end justify-between mb-3">
            <h2 className="text-lg font-bold dark:text-zinc-100">등록된 사진</h2>
            <span className="text-xs text-gray-500 dark:text-zinc-400">사진을 드래그하여 순서를 변경하세요</span>
        </div>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border dashed rounded">이미지가 없습니다.</div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((it, idx) => {
               const src = toUrl(it);
               return (
                <li 
                    key={it.id ?? idx}
                    // 드래그 앤 드롭 이벤트 연결
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragEnter={(e) => handleDragEnter(e, idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()} // 필수: drop 허용
                    className="border border-gray-200 dark:border-zinc-700 rounded p-2 
                               bg-white dark:bg-zinc-900 cursor-move 
                               hover:shadow-lg hover:border-blue-400 transition-all"
                >
                    <div className="relative aspect-square mb-2 group">
                        <img
                            src={src}
                            alt={`photo-${idx}`}
                            className="w-full h-full object-cover rounded bg-gray-100 dark:bg-zinc-800"
                            onError={(e) => { e.currentTarget.style.opacity = 0.3; }}
                        />
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                            No. {idx + 1}
                        </div>
                    </div>
                    
                    <button
                        onClick={() => handleDelete(it.id)}
                        className="w-full border border-red-200 text-red-500 py-1.5 text-sm rounded 
                                   hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
  */

import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const CATEGORIES = [
  { value: "REPRESENTATIVE", label: "전체 대표 사진" },
  { value: "WEDDING_MAIN", label: "웨딩 대표 사진" },
  { value: "FASHION_MAIN", label: "패션 대표 사진" },
  { value: "PRODUCT_MAIN", label: "제품 대표 사진" },
  { value: "FOOD_MAIN", label: "음식 대표 사진" },
  { value: "CAR_MAIN", label: "차 대표 사진" },
  { value: "LANDSCAPE_MAIN", label: "풍경 대표 사진" },
  { value: "DRONE_LANDSCAPE_MAIN", label: "드론 풍경 대표 사진" },
  { value: "WEDDING", label: "웨딩 사진" },
  { value: "FASHION", label: "패션 사진" },
  { value: "PRODUCT", label: "제품 사진" },
  { value: "FOOD", label: "음식 사진" },
  { value: "CAR", label: "차 사진" },
  { value: "LANDSCAPE", label: "풍경 사진" },
  { value: "DRONE_LANDSCAPE", label: "드론 풍경 사진" },
];

// 이미지 URL 처리 (AWS S3 URL 구조에 맞게 null 안전 처리)
const toUrl = (row) => row?.imageUrl || row?.url || row?.image || "";

export default function AdminDashboard() {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

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

  const onFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    previews.forEach(url => URL.revokeObjectURL(url));
    const newPreviews = selectedFiles.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("파일을 선택해 주세요.");
    if (files.length > 30) return alert("한 번에 30장까지만 업로드 가능합니다.");

    setSubmitting(true);
    const token = localStorage.getItem("accessToken");

    try {
      for (const file of files) {
        // 1. 압축 로직 (WebP 변환)
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp"
        };

        let compressedFile = file;
        try {
          compressedFile = await imageCompression(file, options);
        } catch (error) {
          console.error("압축 실패, 원본 사용", error);
        }
        
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

        // 2. AWS S3용 Presigned URL 요청
        const { data: presignedData } = await axios.post(
          "/api/admin/photo/generate-signed-url",
          {
            fileName: newFileName,
            contentType: "image/webp", 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 3. AWS S3 업로드 (PUT 요청)
        await fetch(presignedData.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/webp" },
          body: compressedFile,
        });

        // 4. DB 메타데이터 저장
        await axios.post(
          "/api/admin/photo/save-metadata",
          {
            category: category,
            originalFileName: file.name,
            savedFileName: presignedData.savedFileName, // 백엔드가 생성한 S3 Key(photos/uuid_name.webp)
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } 

      alert(`${files.length}장 업로드 성공`);
      setFiles([]);
      setPreviews([]);
      e.target.reset(); 
      fetchList(category);

    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 중 오류가 발생했습니다. S3 권한이나 CORS 설정을 확인하세요.");
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
      alert("삭제 실패");
      console.error(err);
    }
  };

  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };

  const handleDragEnd = async () => {
    const copyListItems = [...items];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    setItems(copyListItems);

    try {
        const token = localStorage.getItem("accessToken");
        const idList = copyListItems.map(item => item.id);
        await axios.post("/api/admin/photo/order", idList, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (err) {
        console.error("순서 변경 저장 실패", err);
        alert("순서 변경 저장에 실패했습니다.");
        fetchList(category);
    }
  };

  return (
    <div className="px-6 py-6 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-2 dark:text-zinc-100">관리자 페이지 (AWS S3)</h1>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">사진 업로드 및 순서 관리</p>

      <form onSubmit={handleUpload} className="space-y-4 mb-10 border p-4 rounded bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">카테고리</label>
          <select
            className="w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:text-white outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">이미지 파일</label>
          <input type="file" accept="image/*" multiple onChange={onFileChange} className="dark:text-zinc-300 w-full" />
        </div>

        {previews.length > 0 && (
          <div className="flex gap-3 overflow-x-auto py-2">
            {previews.map((src, i) => (
              <div key={i} className="flex-shrink-0">
                <img src={src} alt="preview" className="h-24 w-24 object-cover rounded border dark:border-zinc-600" />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded disabled:opacity-60 dark:bg-white dark:text-black font-medium"
          disabled={submitting}
        >
          {submitting ? "업로드 중..." : `${files.length > 0 ? files.length + '장 ' : ''}업로드`}
        </button>
      </form>

      <section>
        <div className="flex items-end justify-between mb-3">
            <h2 className="text-lg font-bold dark:text-zinc-100">등록된 사진</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">불러오는 중...</div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((it, idx) => (
                <li 
                    key={it.id ?? idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragEnter={(e) => handleDragEnter(e, idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className="border border-gray-200 dark:border-zinc-700 rounded p-2 bg-white dark:bg-zinc-900 cursor-move"
                >
                    <div className="relative aspect-square mb-2">
                        <img
                            src={toUrl(it)}
                            alt=""
                            className="w-full h-full object-cover rounded bg-gray-100 dark:bg-zinc-800"
                        />
                    </div>
                    <button
                        onClick={() => handleDelete(it.id)}
                        className="w-full border border-red-200 text-red-500 py-1.5 text-sm rounded hover:bg-red-50"
                    >
                        삭제
                    </button>
                </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}