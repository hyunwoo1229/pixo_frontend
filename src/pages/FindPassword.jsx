import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RegisterLogo from '../components/Register/RegisterLogo';

export default function FindPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    loginId: '',
    name: '',
    phoneNumber: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSendCode = async () => {
    if (!form.loginId || !form.name || !form.phoneNumber) {
      setError('모든 정보를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/members/password/verification-codes', form);
      setStep(2);
      setError('');
    } catch (err) {
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
      await axios.post('/api/members/password/verify', form);
      setStep(3);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || '인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (form.newPassword.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('새로운 비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await axios.patch('/api/members/password', {
        loginId: form.loginId,
        name: form.name,
        phoneNumber: form.phoneNumber,
        code: form.code,
        password: form.newPassword,
      });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-12 md:pt-24 lg:pt-36 min-h-screen 
                   bg-gray-100 dark:bg-zinc-900">
      <div className="p-10 rounded-xl shadow-xl bg-white dark:bg-zinc-800 w-full max-w-md">
        <RegisterLogo />
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-zinc-100">비밀번호 찾기</h2>

        {step === 1 && (
          <div className="space-y-3">
            <input type="text" name="loginId" placeholder="아이디" value={form.loginId} onChange={handleChange} 
                   className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg
                              bg-white dark:bg-zinc-700 
                              focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="name" placeholder="이름" value={form.name} onChange={handleChange} 
                   className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg
                              bg-white dark:bg-zinc-700 
                              focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="phoneNumber" placeholder="휴대폰 번호 ('-' 없이 입력)" value={form.phoneNumber} onChange={handleChange} 
                   className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg
                              bg-white dark:bg-zinc-700 
                              focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button 
              onClick={handleSendCode} 
              disabled={loading || !form.loginId || !form.name || !form.phoneNumber} 
              className="w-full py-3 mt-1 rounded-lg bg-black text-white font-semibold disabled:opacity-60
                         dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {loading ? '전송 중...' : '인증번호 받기'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-center text-gray-600 dark:text-zinc-300">
              <span className="font-semibold">{form.phoneNumber}</span> (으)로 전송된 인증번호를 입력해주세요.
            </p>
            <input type="text" name="code" placeholder="인증번호 6자리" value={form.code} onChange={handleChange} 
                   className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg
                              bg-white dark:bg-zinc-700 
                              focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleVerifyCode} disabled={loading} 
                    className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-60
                               dark:bg-white dark:text-black dark:hover:bg-gray-200">
              {loading ? '확인 중...' : '인증번호 확인'}
            </button>
          </div>
        )}
        
        {step === 3 && (
            <div className="space-y-3">
                <p className="text-sm text-center text-gray-600 dark:text-zinc-300">새로운 비밀번호를 입력해주세요.</p>
                <input type="password" name="newPassword" placeholder="새 비밀번호" value={form.newPassword} onChange={handleChange} 
                       className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg
                                  bg-white dark:bg-zinc-700 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <input type="password" name="confirmPassword" placeholder="새 비밀번호 확인" value={form.confirmPassword} onChange={handleChange} 
                       className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg
                                  bg-white dark:bg-zinc-700 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button onClick={handleResetPassword} disabled={loading} 
                        className="w-full py-3 mt-1 rounded-lg bg-black text-white font-semibold disabled:opacity-60
                                   dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    {loading ? '변경 중...' : '비밀번호 변경'}
                </button>
            </div>
        )}

        {step === 4 && (
            <div className="text-center p-6 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-700">
                <p className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-4">비밀번호가 성공적으로 변경되었습니다.</p>
                <Link to="/login" className="inline-block px-6 py-2 bg-black text-white rounded-lg font-semibold 
                                           hover:bg-gray-800 transition-colors
                                           dark:bg-white dark:text-black dark:hover:bg-gray-200">로그인하러 가기</Link>
            </div>
        )}

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center mt-4 break-words">{error}</p>}

        <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 underline">
                로그인 화면으로 돌아가기
            </Link>
        </div>
      </div>
    </div>
  );
}