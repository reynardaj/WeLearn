// components/Heading.tsx
import React from "react";
import clsx from "clsx";
import { playfair, openSans } from "@/lib/fonts";

interface HeadingProps {
  className?: string;
  children: React.ReactNode;
}

// Title Component
export const Title: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h1
      className={clsx(
        playfair.className,
        "text-text font-normal mb-6",
        className
      )}
      style={{ fontSize: "4rem", lineHeight: "1" }} // 64px
    >
      {children}
    </h1>
  );
};

// Subtitle Component
export const Subtitle: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h2
      className={clsx(openSans.className, "text-text font-normal", className)}
      style={{ fontSize: "2.5rem", lineHeight: 1.35 }}
    >
      {children}
    </h2>
  );
};

// Heading1 Component
export const Heading1: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h1
      className={clsx(playfair.className, "text-text font-normal ", className)}
      style={{ fontSize: "3rem" }} // 48px
    >
      {children}
    </h1>
  );
};

// Heading2 Component
export const Heading2: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h2
      className={clsx(playfair.className, "text-text font-normal", className)}
      style={{ fontSize: "2.5rem" }} // 40px
    >
      {children}
    </h2>
  );
};

// Heading3 Component
export const Heading3: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h3
      className={clsx(playfair.className, "text-text font-normal", className)}
      style={{ fontSize: "2rem" }} // 32px
    >
      {children}
    </h3>
  );
};

// Heading4 Component
export const Heading4: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h4
      className={clsx(playfair.className, "text-text font-normal", className)}
      style={{ fontSize: "1.25rem" }} // 20px
    >
      {children}
    </h4>
  );
};
