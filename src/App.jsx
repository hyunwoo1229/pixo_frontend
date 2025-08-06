import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Auth from "./pages/Auth"; // ✅ 여기 이름 맞춤
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import SocialExtra from "./pages/SocialExtra";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Auth />} /> {/* ✅ 경로 대응 */}
        <Route path="/oauth-redirect" element={<OAuthRedirectHandler />} />
        <Route path="/social-extra" element={<SocialExtra />} /> 
      </Routes>
    </Router>
  );
}
