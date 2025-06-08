import React, { useState, useEffect, useRef } from "react";

interface InstituteComboboxProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const InstituteCombobox: React.FC<InstituteComboboxProps> = ({ value, onChange, required }) => {
  const [institutes, setInstitutes] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/data/institutes.json")
      .then((res) => res.json())
      .then((data) => {
        const names = Array.isArray(data)
          ? data.map((item) => typeof item === "string" ? item : item.name)
          : [];
        setInstitutes(names);
        setFiltered(names);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (value) {
      setFiltered(
        institutes.filter((inst) =>
          inst.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFiltered(institutes);
    }
  }, [value, institutes]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlighted((prev) => Math.max(prev - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && highlighted < filtered.length) {
        onChange(filtered[highlighted]);
        setOpen(false);
        setHighlighted(-1);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        required={required}
        placeholder="Search or select your institute"
        aria-autocomplete="list"
        aria-controls="institutes-listbox"
        aria-expanded={open}
        aria-activedescendant={highlighted >= 0 ? `institute-${highlighted}` : undefined}
      />
      {open && (
        <div
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-auto"
          id="institutes-listbox"
          role="listbox"
        >
          {loading ? (
            <div className="p-2 text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-2 text-gray-500">No institutes found</div>
          ) : (
            filtered.slice(0, 10).map((inst, idx) => (
              <div
                key={`${inst}-${idx}`}
                id={`institute-${idx}`}
                role="option"
                aria-selected={highlighted === idx}
                className={`cursor-pointer px-4 py-2 hover:bg-primary/10 ${
                  highlighted === idx ? "bg-primary/20" : ""
                }`}
                onMouseDown={() => {
                  onChange(inst);
                  setOpen(false);
                  setHighlighted(-1);
                }}
                onMouseEnter={() => setHighlighted(idx)}
              >
                {inst}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InstituteCombobox;