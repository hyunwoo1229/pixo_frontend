// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import SocialExtra from "./pages/SocialExtra";
import Home from "./pages/Home"; // ✅ Home 추가

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ 홈화면 경로 추가 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/oauth-success" element={<OAuthRedirectHandler />} />
        <Route path="/social-extra" element={<SocialExtra />} />
      </Routes>
    </Router>
  );
}
