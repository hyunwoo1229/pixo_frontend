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
        <div className="cat-image cat-placeholder" />
      )}
      <div className="cat-caption">{label}</div>
    </button>
  );
}
