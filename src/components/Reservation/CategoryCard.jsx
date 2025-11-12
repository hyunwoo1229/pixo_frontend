import React, { useState } from "react";

export default function CategoryCard({ label, image, onClick }) {
  const [broken, setBroken] = useState(false);
  const showImage = image && !broken;

  return (
    <button className="cat-card" type="button" onClick={onClick}>
      {showImage ? (
        <img
          src={image}
          alt={label}
          className="cat-image"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="cat-image cat-placeholder bg-gray-100 dark:bg-zinc-800" />
      )}
      <div className="cat-caption text-gray-800 dark:text-zinc-200">{label}</div>
    </button>
  );
}