"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const LOCALES = [
  { value: "en", label: "EN" },
  { value: "am", label: "አማ" },
];

function getLocaleFromPath(pathname) {
  const seg = pathname.split("/")[1];
  return seg === "en" || seg === "am" ? seg : "en";
}

function buildPathWithLocale(pathname, nextLocale) {
  const parts = pathname.split("/");
  const currentLocale = parts[1];

  if (currentLocale === "en" || currentLocale === "am") {
    parts[1] = nextLocale;
    return parts.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

export default function LanguageSwitcher({ className = "" }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const currentLocale = useMemo(() => getLocaleFromPath(pathname), [pathname]);
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.value === currentLocale) || LOCALES[0];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-7 px-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 text-white text-[11px] font-black tracking-[2px] uppercase flex items-center gap-1.5 transition-all cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{current.label}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-28 rounded-2xl overflow-hidden bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] border border-slate-100"
        >
          {LOCALES.map((l) => {
            const active = l.value === currentLocale;
            return (
              <button
                key={l.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  router.push(buildPathWithLocale(pathname, l.value));
                  router.refresh();
                }}
                className={`w-full text-left px-4 py-3 text-[12px] font-bold transition-colors ${active ? "bg-orange-50 text-[#ff6b0b]" : "bg-white text-[#004360] hover:bg-slate-50"}`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
