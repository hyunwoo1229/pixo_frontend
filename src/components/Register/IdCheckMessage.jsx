import React from "react";

const IdCheckMessage = ({ message, isValid }) => {
  return (
    <p className={`text-sm px-1 ${isValid ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-400"}`}>
      {message}
    </p>
  );
};

export default IdCheckMessage;