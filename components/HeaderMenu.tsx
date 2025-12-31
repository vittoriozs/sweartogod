"use client";

import { categoriesData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const HeaderMenu = () => {
  const pathname = usePathname();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <nav className="hidden md:flex flex-1 items-center justify-center gap-12 uppercase text-sm tracking-widest relative">
      {categoriesData.map((cat) => {
        const isActive =
          cat.slug === "featured"
            ? pathname.startsWith("/category/featured")
            : pathname.startsWith(`/category/${cat.slug}`);

        /* ================= FEATURED ================= */
        if (!cat.subcategories) {
          return (
            <Link key={cat.slug} href={cat.href!} className="relative group">
              <span
                className={`transition ${
                  isActive
                    ? "text-black"
                    : "text-black/80 group-hover:text-black"
                }`}
              >
                {cat.title}
              </span>

              {/* underline */}
              <span
                className={`absolute -bottom-1 left-1/2 h-px bg-black transition-all duration-300
                ${
                  isActive
                    ? "w-1/2 left-0"
                    : "w-0 group-hover:w-1/2 group-hover:left-0"
                }`}
              />
              <span
                className={`absolute -bottom-1 right-1/2 h-px bg-black transition-all duration-300
                ${
                  isActive
                    ? "w-1/2 right-0"
                    : "w-0 group-hover:w-1/2 group-hover:right-0"
                }`}
              />
            </Link>
          );
        }

        /* ================= CATEGORY WITH MEGA DROPDOWN ================= */
        return (
          <div
            key={cat.slug}
            className="relative group"
            onMouseEnter={() => setActiveCategory(cat.slug)}
          >
            {/* LABEL */}
            <Link
              href={`/category/${cat.slug}`}
              className={`relative inline-block uppercase text-sm tracking-widest
                  transition-colors duration-300 ease-out
                  ${isActive ? "text-black" : "text-black/80 group-hover:text-black"}`}
            >
              {cat.title}

              {/* underline */}
              <span
                className={`absolute -bottom-1 left-1/2 h-px bg-black transition-all duration-300
                ${
                  isActive
                    ? "w-1/2 left-0"
                    : "w-0 group-hover:w-1/2 group-hover:left-0"
                }`}
              />
              <span
                className={`absolute -bottom-1 right-1/2 h-px bg-black transition-all duration-300
                ${
                  isActive
                    ? "w-1/2 right-0"
                    : "w-0 group-hover:w-1/2 group-hover:right-0"
                }`}
              />
            </Link>

            {/* ===== HOVER BRIDGE ===== */}
            {activeCategory === cat.slug && (
              <div
                className="fixed left-0 right-0 top-16 h-10 z-30"
                onMouseEnter={() => setActiveCategory(cat.slug)}
                onMouseLeave={() => {
                  setTimeout(() => setActiveCategory(null), 120);
                }}
              />
            )}

            {/* ===== BACKDROP BLUR ===== */}
            <div
              className={`
                  fixed inset-0 top-[72px]
                  bg-black/10 backdrop-blur-sm
                  transition-opacity duration-300 ease-out
                  z-30
                  ${
                    activeCategory === cat.slug
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }
                `}
              onMouseEnter={() => setActiveCategory(cat.slug)}
              onMouseLeave={() => {
                setTimeout(() => setActiveCategory(null), 120);
              }}
            />

            {/* ===== FULL WIDTH DROPDOWN ===== */}
            <div
              className={`
                  fixed left-0 right-0 top-[72px]
                  bg-white z-40
                  transition-all duration-300 ease-out
                  ${
                    activeCategory === cat.slug
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }
                `}
              onMouseEnter={() => setActiveCategory(cat.slug)}
              onMouseLeave={() => {
                setTimeout(() => setActiveCategory(null), 120);
              }}
            >
              <div className="max-w-7xl mx-auto px-20 pt-6 pb-12">
                <ul className="flex flex-col space-y-4 text-xs tracking-widest uppercase">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="text-black/70 hover:text-black transition-colors duration-200"
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;
