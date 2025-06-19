// ✅ components/NumberGrid.tsx
import React from "react";

type NumberStatus = "available" | "pending" | "confirmed";

interface NumberItem {
  number: number;
  status: NumberStatus;
}

interface Props {
  numbers: NumberItem[];
  onSelect: (num: number) => void;
}

export default function NumberGrid({ numbers, onSelect }: Props) {
  return (
    <div className="rifa-grid-internal">
      {numbers.map(({ number, status }) => (
        <button
          key={number}
          className={`number-box ${status}`}
          disabled={status === "confirmed"}
          onClick={() => onSelect(number)}
        >
          {number.toString().padStart(2, "0")}
        </button>
      ))}
    </div>
  );
}
