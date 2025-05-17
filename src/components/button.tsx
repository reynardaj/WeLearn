"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "base" | "lg" | "icon";
}

import { TextMd } from "@/components/Text";
interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant,
  onClick,
}) => {
    let variantClass = "", textClass = "";
  if (variant == "primary") {
    variantClass = "bg-[#1F65A6] text-white hover:bg-[#1F65A6]";
    textClass = "text-white";
  } else if (variant == "secondary") {
    variantClass = "bg-[#F4B660] text-black hover:bg-[#F4B660]";
    textClass = "text-white";
  } else if (variant == "ghost") {
    variantClass = "bg-transparent text-gray-700 hover:underline";
    textClass = "text-black";
  }
  return (
    <button
      type={"button"}
      className={`w-auto h-10 px-4 py-3 rounded-[10px] inline-flex justify-center items-center gap-2.5 cursor-pointer ${variantClass} ${className}`}
      onClick={onClick}
    >
      <TextMd className={`${textClass}`}>{children}</TextMd>
    </button>
  );
};  