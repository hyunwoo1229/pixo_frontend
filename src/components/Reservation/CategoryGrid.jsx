import React from "react";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ items = [], onSelect }) {
  return (
    <div className="cat-grid">
      {items.map((it) => (
        <CategoryCard
          key={it.id}
          label={it.label}
          image={it.image}
          onClick={() => onSelect?.(it)}
        />
      ))}
    </div>
  );
}
