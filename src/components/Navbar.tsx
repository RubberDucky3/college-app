"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { useFavorites } from "@/hooks/useFavorites";
import { useStudentGraph } from "@/contexts/StudentGraph";
import NotificationCenter from "./NotificationCenter";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/today", label: "Today" },
  { href: "/colleges", label: "Colleges" },
  { href: "/match", label: "Match" },
  { href: "/map", label: "Map" },
  { href: "/degrees", label: "Degrees" },
  { href: "/financial", label: "Financial Aid" },
  { href: "/saved", label: "Saved" },
];

const MORE_LINKS = [
  { href: "/roi", label: "ROI" },
  { href: "/admissions", label: "Admissions" },
  { href: "/net-price", label: "Net Price" },
  { href: "/deadlines", label: "Deadlines" },
  { href: "/chat", label: "Chat" },
  { href: "/checklists", label: "Checklists" },
  { href: "/notifications", label: "Alerts" },
];

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [ref, handler]);
}

export default function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { graph, isOnboarded, hydrated } = useStudentGraph();
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setMenuOpen(false));
  useOutsideClick(notifRef, () => setNotifOpen(false));

  useEffect(() => {
    try {
      const raw = localStorage.getItem("collegehub-notifications");
      if (raw) {
        const notifs = JSON.parse(raw).filter((n: { read?: boolean }) => !n.read);
        setUnreadNotifs(notifs.length);
      }
    } catch {
      // ignore
    }
  }, []);

  const studentGraphUnread = graph.notifications?.filter((n) => !n.read).length ?? 0;
  const totalUnread = unreadNotifs + studentGraphUnread;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            CollegeHub
          </span>
          <span className="hidden rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 sm:inline">
            Beta
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              }`}
            >
              {link.label}
              {link.href === "/saved" && favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </Link>
          ))}

          {/* More dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                menuOpen
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              }`}
            >
              More
              <svg className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-4 py-2 text-sm transition-colors ${
                      isActive(link.href)
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    {link.label}
                    {link.href === "/notifications" && totalUnread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {totalUnread > 9 ? "9+" : totalUnread}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* Notifications bell */}
          {hydrated && (
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                {totalUnread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <NotificationCenter onClose={() => setNotifOpen(false)} />
                </div>
              )}
            </div>
          )}

          {/* Profile avatar */}
          {hydrated && isOnboarded && graph.firstName && (
            <Link
              href="/dashboard"
              className="ml-2 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {graph.firstName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden lg:inline">{graph.firstName}</span>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
          {[...MAIN_LINKS, ...MORE_LINKS].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              }`}
            >
              {link.label}
              {link.href === "/saved" && favorites.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
              {link.href === "/notifications" && totalUnread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
