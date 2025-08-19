import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import SocialExtra from "./pages/SocialExtra";
import ChangePassword from "./pages/ChangePassword";
import Withdraw from "./pages/Withdraw";
import Type from "./pages/Reservation/Type";
import DatePick from "./pages/Reservation/Date";
import Form from "./pages/Reservation/Form";
import Complete from "./pages/Reservation/Complete";
import QuestionList from "./pages/Question/QuestionList";
import QuestionFormPage from "./pages/Question/QuestionFormPage";
import ReservationHistory from "./pages/ReservationHistory";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminMenu from "./pages/Admin/AdminMenu"; // 👈 추가

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ 푸터/헤더 포함되는 화면들 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/price" element={<div className="px-6 pt-4">가격</div>} />
          <Route path="/reserve" element={<div className="px-6 pt-4">예약하기</div>} />
          <Route path="/inquiry" element={<div className="px-6 pt-4">1:1 문의</div>} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/withdraw" element={<Withdraw />} />
          
          <Route path="/reservation-history" element={<ReservationHistory />} />

          <Route path="/reserve/type" element={<Type />} />
          <Route path="/reserve/date" element={<DatePick />} />
          <Route path="/reserve/form" element={<Form />} />
          <Route path="/reserve/complete" element={<Complete />} />
          <Route path="/question" element={<QuestionList />} />
          <Route path="/question/new" element={<QuestionFormPage />} />
          <Route path="/question/edit/:id" element={<QuestionFormPage />} />

          {/* ▼▼▼▼▼ 관리자 페이지 경로 수정 ▼▼▼▼▼ */}
          <Route path="/admin" element={<AdminMenu />} />
          <Route path="/admin/photos" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<QuestionList />} />
          {/* ▲▲▲▲▲ 관리자 페이지 경로 수정 ▲▲▲▲▲ */}
        </Route>

        {/* ❌ 푸터 없이: 인증 플로우 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/oauth-success" element={<OAuthRedirectHandler />} />
        <Route path="/social-extra" element={<SocialExtra />} />
      </Routes>
    </Router>
  );
}