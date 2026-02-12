"use client";

import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t-4 border-border bg-bg mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            {"Dibuat dengan"}{" "}
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />{" "}
            {"untuk mengurangi stress"}
          </p>
          <p>
            {"© "}{new Date().getFullYear()}{" Keluh Kesah. Semua hak dilindungi."}
          </p>
        </div>
      </div>
    </footer>
  );
}
