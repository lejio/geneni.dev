import React, { type JSX } from "react";
import { IoMdHome, IoMdRocket, IoMdPerson, IoMdMail } from "react-icons/io";
import { useState } from "react";
import type { IconType } from "react-icons";

interface NavProps {
  currentPath: string;
  size: number;
}

interface NavItem {
    name: string;
    href: string;
    color: string;
    icon: JSX.Element
}

export default function NavItems({ currentPath, size }: NavProps) {
  const navItems = [
    {
      name: "Home",
      href: "/",
      color: "#087E8B",
      icon: (
        <IoMdHome
          size={size}
          className="transition-all duration-300 hover:text-[#087E8B]"
        />
      ),
    },
    {
      name: "Projects",
      href: "/projects",
      color: "#C81D25",
      icon: (
        <IoMdRocket
          size={size}
          className="transition-all duration-300 hover:text-[#C81D25] rotate-45"
        />
      ),
    },
    {
      name: "About",
      href: "/about",
      color: "#FF5A5F",
      icon: (
        <IoMdPerson
          size={size}
          className="transition-all duration-300 hover:text-[#FF5A5F]"
        />
      ),
    },
    {
      name: "Contact",
      href: "/contact",
      color: "#35c38f",
      icon: (
        <IoMdMail
          size={size}
          className="transition-all duration-300 hover:text-[#35c38f]"
        />
      ),
    },
  ];

  const currentItem =
    navItems.find((item) => item.href === currentPath) ?? navItems[0];

  const [currHover, setCurrHover] = useState<NavItem | null>(currentItem)

  return (
    <div className="group relative mt-5 flex justify-center items-center align-middle gap-5" onMouseLeave={() => {
        setCurrHover(currentItem)
    }}>
      <div className="w-16 h-16 group-hover:w-64 rounded-full transition-all duration-300 bg-white border-2 text-black py-2 flex justify-center align-middle items-center overflow-hidden"
      style={{
        borderColor: currHover?.color ?? "black",
      }}>
        <a
          href={currentItem.href}
          className="flex items-center justify-center min-w-[2rem] h-8 group-hover:hidden"
          title={currentItem.name}
        >
          {currentItem.icon}
        </a>

        <ul className="hidden w-full group-hover:flex flex-row justify-evenly items-center align-middle">
          {navItems.map((item) => {
            if (item.href === currentPath) return null; // Skip current
            return (
              <li>
                <a
                  href={item.href}
                  className="hover:underline whitespace-nowrap"
                  title={item.name}
                  onMouseEnter={() => {
                    setCurrHover(item)
                  }}
                  onMouseLeave={() => {
                    setCurrHover(null)
                  }}
                >
                  {item.icon}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <p>{currHover? currHover.name: null}</p>
    </div>
  );
}
