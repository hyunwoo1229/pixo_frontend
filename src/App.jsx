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
import FindPassword from "./pages/FindPassword";
import Over14 from "./pages/Over14";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CategoryDetail from "./pages/CategoryDetail";
import ScrollToTop from "./components/ScrollToTop";
import AdminScheduleManagement from "./pages/Admin/AdminScheduleManagement";
import Introduce from "./pages/Introduce"; 
import Price from "./pages/Price"; 
import MyInfoPage from "./pages/MyInfoPage"; 

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ✅ 푸터/헤더 포함되는 화면들 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/introduce" element={<Introduce />} />
          <Route path="/price" element={<Price />} />
          <Route path="/reservations" element={<div className="px-6 pt-4">예약하기</div>} />
          <Route path="/inquiry" element={<div className="px-6 pt-4">1:1 문의</div>} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/withdraw" element={<Withdraw />} />
          
          <Route path="/reservations/type" element={<Type />} />
          <Route path="/reservations/date" element={<DatePick />} />
          <Route path="/reservations/form" element={<Form />} />
          <Route path="/reservations/complete" element={<Complete />} />
          <Route path="/reservations/history" element={<ReservationHistory />} />

          <Route path="/my-info" element={<MyInfoPage />} /> 
          
          {/* 1. 일반 사용자용 /question 경로 추가 */}
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/new" element={<QuestionFormPage />} />
          <Route path="/questions/edit/:id" element={<QuestionFormPage />} />

          {/* 2. 관리자 페이지 경로 정리 (중복 제거) */}
          <Route path="/admin" element={<AdminMenu />} />
          <Route path="/admin/photos" element={<AdminDashboard />} />
          <Route path="/admin/reservations" element={<AdminReservationManagement />} />
          <Route path="/admin/members" element={<AdminMemberManagement />} />
          {/* 관리자용 1:1 문의 경로는 isAdmin={true} 속성을 전달합니다. */}
          <Route path="/admin/questions" element={<QuestionList isAdmin={true} />} />

          <Route path="/category/:categoryId" element={<CategoryDetail />} />
          <Route path="/admin/schedule" element={<AdminScheduleManagement />} /> 
        </Route>

        {/* ❌ 푸터 없이: 인증 플로우 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/oauth-success" element={<OAuthRedirectHandler />} />
        <Route path="/social-extra" element={<SocialExtra />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/over14" element={<Over14 />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
}