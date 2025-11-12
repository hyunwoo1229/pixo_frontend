import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import RegisterLogo from '../components/Register/RegisterLogo'; 

export default function FindId() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [step, setStep] = useState(1); // 1: 정보 입력, 2: 인증번호 입력, 3: 결과 확인
  const [form, setForm] = useState({ name: '', phoneNumber: '', code: '' });
  const [foundId, setFoundId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSendCode = async () => {
    if (!form.name || !form.phoneNumber) {
      setError('이름과 휴대폰 번호를 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/member/find-id/send-code', {
        name: form.name,
        phoneNumber: form.phoneNumber,
      });
      setStep(2); // 인증번호 입력 단계로 이동
      setError(''); // 성공 시 에러 메시지 초기화
    } catch (err) {
      // 백엔드 전역 예외 처리기가 있으므로 err.response?.data?.message를 사용
      setError(err.response?.data?.message || '인증번호 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!form.code) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/member/find-id/verify', {
        name: form.name,
        phoneNumber: form.phoneNumber,
        code: form.code,
      });
      setFoundId(data.loginId);
      setStep(3); // 결과 확인 단계로 이동
      setError(''); // 성공 시 에러 메시지 초기화
    } catch (err) {
      // 백엔드 전역 예외 처리기가 있으므로 err.response?.data?.message를 사용
      setError(err.response?.data?.message || '아이디 찾기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-12 md:pt-24 lg:pt-36 min-h-screen 
                   bg-gray-100 dark:bg-zinc-900">
      <div className="p-10 rounded-xl shadow-xl bg-white dark:bg-zinc-800 w-full max-w-md overflow-visible">
        <RegisterLogo /> {/* 로그인 화면과 동일한 로고 컴포넌트 */}

        <h2 className="text-2xl font-bold text-center mb-6 dark:text-zinc-100">아이디 찾기</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3
                         bg-white dark:bg-zinc-700 dark:border-zinc-600"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="휴대폰 번호 ('-' 없이 입력)"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4
                         bg-white dark:bg-zinc-700 dark:border-zinc-600"
            />
            <button
              onClick={handleSendCode}
              disabled={loading || !form.name || !form.phoneNumber}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold 
                         hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                         dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {loading ? '인증번호 전송 중...' : '인증번호 받기'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-center text-gray-600 dark:text-zinc-300 mb-4">
              <span className="font-semibold">{form.phoneNumber}</span> (으)로 전송된 인증번호 6자리를 입력해주세요.
            </p>
            <input
              type="text"
              name="code"
              placeholder="인증번호 6자리"
              value={form.code}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4
                         bg-white dark:bg-zinc-700 dark:border-zinc-600"
            />
            <button
              onClick={handleVerifyCode}
              disabled={loading || !form.code}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold 
                         hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                         dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {loading ? '확인 중...' : '아이디 찾기'}
            </button>
          </>
        )}

        {step === 3 && (
          <div className="text-center p-6 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-700">
            <p className="text-gray-700 dark:text-zinc-300 text-base mb-2">회원님의 아이디입니다.</p>
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">{foundId}</p>
            <Link 
              to="/login" 
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              로그인하러 가기
            </Link>
          </div>
        )}

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm sm:text-base mt-4 break-words whitespace-pre-wrap min-h-[1.5rem] w-full text-center">
            {error}
          </p>
        )}

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="inline-block px-6 py-2 bg-black text-white rounded-lg font-semibold 
                       hover:bg-gray-800 transition-colors
                       dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
          >
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}