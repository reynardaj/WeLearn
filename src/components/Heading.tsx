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
        "text-text text-6xl font-normal",
        className
      )}
    >
      {children}
    </h1>
  );
};

// Subtitle Component
export const Subtitle: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h2
      className={clsx(
        openSans.className,
        "text-text text-4xl font-normal leading-[54.09px]",
        className
      )}
    >
      {children}
    </h2>
  );
};

// Heading1 Component
export const Heading1: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h1
      className={clsx(
        playfair.className,
        "text-text text-5xl font-normal",
        className
      )}
    >
      {children}
    </h1>
  );
};

// Heading2 Component
export const Heading2: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h2
      className={clsx(
        playfair.className,
        "text-text text-4xl font-normal",
        className
      )}
    >
      {children}
    </h2>
  );
};

// Heading3 Component
export const Heading3: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h3
      className={clsx(
        playfair.className,
        "text-text text-3xl font-normal",
        className
      )}
    >
      {children}
    </h3>
  );
};

// Heading4 Component
export const Heading4: React.FC<HeadingProps> = ({ className, children }) => {
  return (
    <h4
      className={clsx(
        playfair.className,
        "text-text text-xl font-normal",
        className
      )}
    >
      {children}
    </h4>
  );
};
