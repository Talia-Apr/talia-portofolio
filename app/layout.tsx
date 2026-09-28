import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import SoundToggle from "@/components/SoundToggle";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "talia's zip",
  description: "Portofolio Talia Aprianti — about, project, certification, contact",
  icons: {
    icon: "/logo/talogo.png",
  },
};

// Runs before the page paints, so the correct theme (saved choice, or the
// OS preference if none was saved yet) is applied immediately — no flash
// of the wrong theme on first load.
const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem("talia-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${baloo.variable} ${quicksand.variable} font-body`}
        suppressHydrationWarning
      >
        <ThemeToggle />
        <SoundToggle />
        {children}
      </body>
    </html>
  );
}
