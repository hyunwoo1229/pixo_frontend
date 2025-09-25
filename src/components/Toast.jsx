import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3초 뒤 자동 닫힘
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#333",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "8px",
      zIndex: 1000
    }}>
      {message}
    </div>
  );
}
