"use client";

import React from "react";

interface CategoryPillsProps {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}

export default function CategoryPills({
  categories,
  active,
  onSelect,
}: CategoryPillsProps) {
  return (
    <div className="pills-scroll flex gap-2 pb-1">
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
            active === cat ? "pill-active" : "pill-inactive"
          }`}
          style={{ fontFamily: "Manrope, sans-serif", fontSize: "12px" }}
          aria-pressed={active === cat}
          aria-label={`Filter by ${cat}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
