import React, { ReactNode } from "react";

interface CardProps {
  child: ReactNode;
}

export const Card = ({ child }: CardProps) => {
  return (
    <div className="border-solid border-2 border-sky-500 text-xl font-bold">
      {child}
    </div>
  );
};
