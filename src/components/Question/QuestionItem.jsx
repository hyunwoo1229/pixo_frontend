// ...상단 import/유틸 동일
export default function QuestionItem({ item, mineOnly, onChanged }) {
    // ...내부 로직 동일
    const COLS = "grid grid-cols-[88px,1fr,72px,78px] gap-x-2";
  
    return (
      <li className="border-b">
        {/* 4열 행 */}
        <button
          onClick={() => setOpen((v) => !v)}
           className="grid text-sm border-b border-t py-2"
          style={{
            gridTemplateColumns: "85px 1fr 60px 60px", // 답변상태 | 제목 | 작성자 | 작성일
            columnGap: "8px",
          }}
        >
          <div className="text-sm">{status}</div>
          <div className="text-sm line-clamp-1 pl-2">{item.title}</div>{/* 제목만 살짝 띄움 */}
          <div className="text-sm text-center">{author}</div>
          <div className="text-sm text-right">{date}</div>
        </button>
  
        {open && (
          <div className="px-1 pb-4 text-sm space-y-3">
            {item?.content && <div className="whitespace-pre-wrap leading-6">{item.content}</div>}
            {item?.answer && (
              <div className="pl-4 border-l-2">
                <div className="text-gray-600 mb-1">└ {item.answer}</div>
                <div className="text-xs text-gray-400">PIXO · {formatYmd(item.answerCreatedAt)}</div>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-1">
              <button className="px-3 py-1 text-xs border rounded"
                onClick={() => nav(`/question/edit/${item.id}`, { state: { item } })}>수정</button>
              <button className="px-3 py-1 text-xs border rounded" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        )}
      </li>
    );
  }
  