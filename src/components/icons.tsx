"use client";

import React from "react";

export const ChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={`w-5 h-5 ${props.className ?? ""}`}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={`w-5 h-5 ${props.className ?? ""}`}
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);
