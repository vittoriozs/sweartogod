import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className="inline-flex">
      <h2
        className={cn(
          "text-3xl text-black font-bebas tracking-wider uppercase",
          className
        )}
      >
        Swear to God
      </h2>
    </Link>
  );
};

export default Logo;
