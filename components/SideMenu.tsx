import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { categoryNav } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-white text-black/80 h-screen p-10 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between gap-5">
          <div onClick={onClose} className="cursor-pointer">
            <Logo className="text-black" />
          </div>
          <button
            onClick={onClose}
            className="hover:text-dark-grey hoverEffect"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {categoryNav?.map((item) => (
            <Link
              href={item.href}
              key={item?.title}
              className={`hover:text-dark-grey hoverEffect ${
                pathname === item?.href && "text-black font-extrabold"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <SocialMedia
          className="text-black/60"
          iconClassName="border-black/60 hover:border-dark-grey hover:text-dark-grey"
          tooltipClassName="bg-black text-white"
        />
      </div>
    </div>
  );
};

export default SideMenu;
