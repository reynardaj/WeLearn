"use client";

import type React from "react";
import CreatableSelect from "react-select/creatable";
import { Label } from "@/components/ui/label";
import { TextMd, TextSm } from "./Text";

// Define the option type for TypeScript
export interface Option {
  label: string;
  value: string;
}

// Define props for the SubjectInput component
interface SubjectInputProps {
  options: Option[]; // List of available subjects
  value: Option[]; // Currently selected subjects
  onChange: (selected: Option[]) => void; // Callback for selection changes
  placeholder?: string; // Optional placeholder text
}

const SubjectInput: React.FC<SubjectInputProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="subjects-input" className="text-sm font-medium">
        <TextMd>Teaching Subjects</TextMd>
      </Label>
      <CreatableSelect
        inputId="subjects-input"
        isMulti
        options={options}
        value={value}
        onChange={(selected) => onChange(selected as Option[])}
        placeholder={
          <TextSm className="text-muted">
            {placeholder || "Select or create subjects..."}
          </TextSm>
        }
        classNamePrefix="react-select"
        className="bg-container "
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "border-primary" : "border-primary",
            boxShadow: state.isFocused ? "0 0 0 1px border-primary" : "none",
            "&:hover": {
              borderColor: state.isFocused
                ? "border-primary "
                : "border-primary",
            },
            borderRadius: "calc(var(--radius) - 2px)",
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            backgroundColor: "var(--container)",
            border: "1px solid var(--border)",
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isSelected
              ? "var(--primary)"
              : state.isFocused
              ? "var(--accent)"
              : "var(--background)",
            color: state.isSelected ? "var(--primary)" : "inherit",
            cursor: "pointer",
          }),
          multiValue: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "var(--accent)",
            borderRadius: "calc(var(--radius) - 4px)",
          }),
          multiValueLabel: (baseStyles) => ({
            ...baseStyles,
            color: "var(--accent-foreground)",
          }),
          multiValueRemove: (baseStyles) => ({
            ...baseStyles,
            color: "var(--accent-foreground)",
            "&:hover": {
              backgroundColor: "transparent",
              color: "var(--destructive-foreground)",
              cursor: "pointer",
            },
          }),
        }}
        aria-live-region-id="react-select-1-live-region"
        aria-placeholder-id="react-select-1-placeholder"
      />
      <TextSm className="text-xs text-muted mt-1">
        Select from existing subjects or create new ones by typing and pressing
        enter
      </TextSm>
    </div>
  );
};

export default SubjectInput;
