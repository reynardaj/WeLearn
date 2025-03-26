// components/Text.tsx
import React from "react";
import clsx from "clsx";
import { openSans } from "@/lib/fonts"; // Adjust path based on your project structure

type ElementType = keyof JSX.IntrinsicElements | React.ComponentType<any>;

interface TextProps {
  as?: ElementType;
  variant?: "lg" | "md" | "sm";
  className?: string;
  children: React.ReactNode;
}

const textVariantClasses: Record<
  TextProps["variant"],
  { className: string; font: string }
> = {
  lg: { className: "text-2xl", font: openSans.className },
  md: { className: "text-base", font: openSans.className },
  sm: { className: "text-xs", font: openSans.className },
};

export const Text: React.FC<TextProps> = ({
  variant = "md",
  as = "p",
  className,
  children,
}) => {
  const Component = as;
  const { className: variantClass, font } =
    textVariantClasses[variant] || textVariantClasses["md"];
  return (
    <Component
      className={clsx(font, "text-text font-normal", variantClass, className)}
    >
      {children}
    </Component>
  );
};
