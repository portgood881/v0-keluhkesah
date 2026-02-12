"use client";

import { Inbox, SearchX } from "lucide-react";

interface EmptyStateProps {
  isSearching?: boolean;
}

export function EmptyState({ isSearching = false }: EmptyStateProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-base border-2 border-border bg-bg shadow-shadow mb-4">
        {isSearching ? (
          <SearchX className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Inbox className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-bold text-text mb-1">
        {isSearching ? "Tidak ditemukan" : "Belum ada keluhan"}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {isSearching
          ? "Coba kata kunci lain atau hapus pencarian untuk melihat semua keluhan."
          : "Jadilah yang pertama untuk menulis keluhan. Jangan simpan sendiri!"}
      </p>
    </div>
  );
}
