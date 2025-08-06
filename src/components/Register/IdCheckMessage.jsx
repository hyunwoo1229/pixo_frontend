import React from "react";

const IdCheckMessage = ({ message, isValid }) => {
  return (
    <p className={`text-sm px-1 ${isValid ? "text-green-600" : "text-red-500"}`}>
      {message}
    </p>
  );
};

export default IdCheckMessage;