import React from "react";
import { Link } from "react-router-dom"; 

const agreements = [
  { name: "over14", label: "[필수] 14세 이상 확인 및 동의", link: "/over14" },
  { name: "terms", label: "[필수] 이용 약관 동의", link: "/terms" },
  { name: "privacy", label: "[필수] 개인정보 처리 방침 동의", link: "/privacy" },
];

const AgreementSection = ({ form, handleChange, isExpanded, toggleExpand }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 py-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-5 h-5 rounded 
                       border border-gray-400 dark:border-zinc-500 bg-white dark:bg-zinc-700
                       checked:bg-black checked:text-white dark:checked:bg-white dark:checked:text-black"
            name="all"
            checked={form.agreements.all}
            onChange={handleChange}
          />
          <span className="font-bold text-base dark:text-zinc-100">필수 약관 전체 동의</span>
        </label>
        <button onClick={toggleExpand} className="focus:outline-none dark:text-zinc-300">
          <svg
            className={`w-5 h-5 ml-2 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {agreements.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between border border-gray-200 dark:border-zinc-700 
                         rounded px-4 py-3 bg-white dark:bg-zinc-800"
            >
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded 
                             border border-gray-400 dark:border-zinc-500 bg-white dark:bg-zinc-700
                             checked:bg-black checked:text-white dark:checked:bg-white dark:checked:text-black"
                  name={item.name}
                  checked={form.agreements[item.name]}
                  onChange={handleChange}
                />
                <span className="dark:text-zinc-200">{item.label}</span>
              </label>

              <Link to={item.link} target="_blank" rel="noopener noreferrer">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-zinc-400 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgreementSection;