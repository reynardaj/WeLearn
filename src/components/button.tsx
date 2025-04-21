"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "base" | "lg" | "icon";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "base",
  className = "",
  ...props
}) => {
  let variantClass = "";
  if (variant === "default") {
    variantClass = "bg-blue-700 text-white hover:bg-blue-800";
  } else if (variant === "outline") {
    variantClass = "border border-gray-300 text-gray-700 hover:bg-gray-100";
  }

  let sizeClass = "";
  if (size === "sm") {
    sizeClass = "px-3 py-1.5 text-sm";
  } else if (size === "base") {
    sizeClass = "px-4 py-2 text-base";
  } else if (size === "lg") {
    sizeClass = "px-6 py-3 text-lg";
  } else if (size === "icon") {
    sizeClass = "p-2 w-10 h-10";
  }

  const combined = `inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClass} ${sizeClass} ${className}`;

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
};
