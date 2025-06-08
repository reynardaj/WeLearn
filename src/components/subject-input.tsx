"use client";

import type React from "react";
import CreatableSelect from "react-select/creatable";
import { Label } from "@/components/ui/label";
import { TextMd, TextSm } from "./Text";

export interface Option {
  label: string;
  value: string;
}

interface SubjectInputProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
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
        <TextMd>Subject You Specialize In</TextMd>
      </Label>
      <CreatableSelect
        inputId="subjects-input"
        isMulti
        options={options}
        value={value}
        onChange={(selected) => onChange(selected as Option[])}
        placeholder={
          <TextSm className="!text-gray-400">
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
              borderColor: "var(--border)",
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
      />
      <TextSm className="text-xs text-muted mt-1">
        Select from existing subjects or create new ones by typing and pressing
        enter
      </TextSm>
    </div>
  );
};

export default SubjectInput;
