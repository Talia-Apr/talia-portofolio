"use client";

import { useEffect, useState } from "react";
import {
  Sun, Moon
} from 'lucide-react'

/**
 * Small floating button that flips the site between light and dark mode.
 * The actual class-swap on <html> happens in two places:
 *  1. An inline script in app/layout.tsx (runs before paint, so there's
 *     no flash of the wrong theme on first load).
 *  2. This component (after the user clicks, and to stay in sync with
 *     the OS theme if they haven't picked one manually yet).
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      window.localStorage.setItem("talia-theme", next ? "dark" : "light");
    } catch {
      // Ignore storage errors (e.g. private browsing) — theme just
      // won't persist across reloads.
    }
  }

  // Avoid rendering theme-dependent UI before we know which theme is
  // active, so the server- and client-rendered markup always match.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Ganti tema"
        className="fixed top-4 right-4 z-50 h-10 w-10 rounded-full bg-[var(--card-bg)] backdrop-blur shadow-sm"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="fixed top-5 right-5 z-50 h-10 w-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] backdrop-blur shadow-sm text-lg transition-transform hover:scale-105 active:scale-95"
    >
      <span aria-hidden="true">{isDark ? (
        <Moon size={25} color="#ffffff" />   // lavender
      ) : (
        <Sun size={25} color="#b23763" />    // pink
      )}</span>
    </button>
  );
}
