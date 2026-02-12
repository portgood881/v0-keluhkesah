"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type SortOption = "newest" | "oldest" | "most_loved" | "most_commented";

interface SearchSortBarProps {
  onSearch: (query: string) => void;
  onSort: (sort: SortOption) => void;
  currentSort: SortOption;
}

const sortLabels: Record<SortOption, string> = {
  newest: "Terbaru",
  oldest: "Terlama",
  most_loved: "Paling Disukai",
  most_commented: "Paling Banyak Komentar",
};

export function SearchSortBar({
  onSearch,
  onSort,
  currentSort,
}: SearchSortBarProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);
  };

  return (
    <div className="relative z-10 flex items-center gap-2 max-w-xl mx-auto mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder="Cari keluhan..."
          className="pl-9 bg-bg"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <div className="relative" ref={sortMenuRef}>
        <Button
          variant="neutral"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={() => setShowSortMenu(!showSortMenu)}
          aria-label="Sort options"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
        {showSortMenu && (
          <div className="absolute right-0 top-12 w-56 rounded-base border-2 border-border bg-bg shadow-shadow z-50">
            {(Object.entries(sortLabels) as [SortOption, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-main hover:text-mtext ${
                    currentSort === key
                      ? "bg-main text-mtext font-semibold"
                      : "text-text"
                  }`}
                  onClick={() => {
                    onSort(key);
                    setShowSortMenu(false);
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
