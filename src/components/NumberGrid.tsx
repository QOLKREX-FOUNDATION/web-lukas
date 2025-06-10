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
      {numbers.map(({ number, status }) => {
        let bgColor = "bg-gray-300";
        if (status === "pending") bgColor = "bg-yellow-400";
        if (status === "confirmed") bgColor = "bg-green-500";

        return (
          <button
            key={number}
            className={`w-10 h-10 rounded-md font-bold text-white ${bgColor}`}
            disabled={status === "confirmed"}
            onClick={() => onSelect(number)}
          >
            {number.toString().padStart(2, "0")}
          </button>
        );
      })}
    </div>
  );
}
