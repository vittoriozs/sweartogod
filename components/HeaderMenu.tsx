"use client";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-1/6 items-center justify-center gap-7 capitalize font-light">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`hover:text-black hoverEffect relative group ${
            pathname === item?.href && "text-black"
          }`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-black group-hover:w-1/2 hoverEffect group-hover:left-0 ${
              pathname === item?.href ? "w-1/2 left-0" : ""
            }`}
          />

          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-black group-hover:w-1/2 hoverEffect group-hover:right-0 ${
              pathname === item?.href ? "w-1/2 right-0" : ""
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
