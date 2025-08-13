// src/App.jsx
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
          <Route path="/reservation-history" element={<div className="px-6 pt-4">예약 조회</div>} />
          <Route path="/reserve/type" element={<Type />} />
          <Route path="/reserve/date" element={<DatePick />} />
          <Route path="/reserve/form" element={<Form />} />
          <Route path="/reserve/complete" element={<Complete />} />
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
