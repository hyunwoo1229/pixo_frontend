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
import AdminMenu from "./pages/Admin/AdminMenu"; 
import AdminReservationManagement from "./pages/Admin/AdminReservationManagement"; 
import AdminMemberManagement from "./pages/Admin/AdminMemberManagement";
import FindId from "./pages/FindId"; 

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
          
          {/* 1. 일반 사용자용 /question 경로 추가 */}
          <Route path="/question" element={<QuestionList />} />
          <Route path="/question/new" element={<QuestionFormPage />} />
          <Route path="/question/edit/:id" element={<QuestionFormPage />} />

          {/* 2. 관리자 페이지 경로 정리 (중복 제거) */}
          <Route path="/admin" element={<AdminMenu />} />
          <Route path="/admin/photos" element={<AdminDashboard />} />
          <Route path="/admin/reservations" element={<AdminReservationManagement />} />
          <Route path="/admin/members" element={<AdminMemberManagement />} />
          {/* 관리자용 1:1 문의 경로는 isAdmin={true} 속성을 전달합니다. */}
          <Route path="/admin/questions" element={<QuestionList isAdmin={true} />} />
        </Route>

        {/* ❌ 푸터 없이: 인증 플로우 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/oauth-success" element={<OAuthRedirectHandler />} />
        <Route path="/social-extra" element={<SocialExtra />} />
        <Route path="/find-id" element={<FindId />} />
      </Routes>
    </Router>
  );
}