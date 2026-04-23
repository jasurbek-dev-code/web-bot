import React from 'react';

export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 })?.map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="skeleton aspect-square w-full" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-4 rounded-lg w-4/5" />
            <div className="flex justify-between items-center">
              <div className="skeleton h-4 rounded-lg w-1/3" />
              <div className="skeleton h-9 w-9 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
