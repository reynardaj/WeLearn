// components/Text.tsx
import React from "react";
import clsx from "clsx";
import { openSans } from "@/lib/fonts";

interface TextProps {
  className?: string;
  children: React.ReactNode;
}

export const TextLg: React.FC<TextProps> = ({ className, children }) => {
  return (
    <p
      className={clsx(openSans.className, "text-text font-normal", className)}
      style={{ fontSize: "1.5rem" }}
    >
      {children}
    </p>
  );
};

export const TextMd: React.FC<TextProps> = ({ className, children }) => {
  return (
    <p
      className={clsx(openSans.className, "text-text font-normal", className)}
      style={{ fontSize: "1rem" }}
    >
      {children}
    </p>
  );
};

export const TextSm: React.FC<TextProps> = ({ className, children }) => {
  return (
    <p
      className={clsx(openSans.className, "text-text font-normal", className)}
      style={{ fontSize: "0.81rem" }}
    >
      {children}
    </p>
  );
};
