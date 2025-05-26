import { type JSX, useEffect, useRef, useState } from "react";
import { IoMdHome, IoMdRocket, IoMdPerson, IoMdMail, IoMdBriefcase } from "react-icons/io";

import { GoHome, GoRocket, GoPerson, GoMail, GoBriefcase } from "react-icons/go";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import { isNavOpen, setIsNavOpen } from "../lib/stores";

interface NavProps {
  currentPath: string;
  size: number;
}

interface NavItem {
  name: string;
  href: string;
  color: string;
  icon: JSX.Element;
}

export default function NavItems({ currentPath, size }: NavProps) {
  const [isMobile, setIsMobile] = useState(false);
  const navOpen = useStore(isNavOpen);
  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      color: "#e879f9",
      icon: (
        <IoMdHome
          className="transition-all duration-300 hover:text-[#e879f9]"
          size={size}
        />
      ),
    },
    {
      name: "Experience",
      href: "/experience",
      color: "#a872f4",
      icon: (
        <IoMdBriefcase
          size={size}
          className="transition-all duration-300 hover:text-[#a872f4]"
        />
      ),
    },
    {
      name: "Projects",
      href: "/projects",
      color: "#876ef1",
      icon: (
        <IoMdRocket
          size={size}
          className="rotate-45 transition-all duration-300 hover:text-[#876ef1]"
        />
      ),
    },
    {
      name: "About",
      href: "/about",
      color: "#6b6bef",
      icon: (
        <IoMdPerson
          size={size}
          className="transition-all duration-300 hover:text-[#6b6bef]"
        />
      ),
    },
    {
      name: "Contact",
      href: "/contact",
      color: "#2963ea",
      icon: (
        <IoMdMail
          size={size}
          className="transition-all duration-300 hover:text-[#2963ea]"
        />
      ),
    },
  ];

  const [currentItem, setCurrentItem] = useState(
    navItems.find((item) => item.href === currentPath) ?? navItems[0]
  );

  const [currHover, setCurrHover] = useState<NavItem | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isExpanded = isMobile || currHover !== null;

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrHover(currentItem);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    console.log("Closed!");
    setIsNavOpen(false);
    timeoutRef.current = setTimeout(() => {
      setCurrHover(null);
    }, 300);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1080); // Tailwind's `md` breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="relative flex justify-center items-center gap-2 md:gap-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        layout
        initial={{ width: 64, borderColor: currentItem.color }}
        animate={{
          width: isExpanded ? 256 : 64,
          borderColor: (currHover ?? currentItem).color,
        }}
        transition={{ duration: 0.3 }}
        className="h-14 rounded-full bg-white text-black flex justify-center items-center overflow-hidden"
      >
        {!isExpanded || navOpen ? (
          <a
            href={currentItem.href}
            className="flex items-center justify-center min-w-[2rem] h-8"
            onClick={() => {
              console.log("Open!");
              setIsNavOpen(true);
            }}
            title={currentItem.name}
          >
            {currentItem.icon}
          </a>
        ) : (
          <ul className="w-full flex flex-row justify-evenly items-center">
            {navItems.map((item, idx) => {
              return (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="hover:underline whitespace-nowrap"
                    title={item.name}
                    onMouseEnter={() => setCurrHover(item)}
                    onClick={() => {
                      setCurrentItem(item);
                    }}
                  >
                    {item.icon}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>

      <div className="relative h-5">
        <AnimatePresence mode="wait">
          {isExpanded && currHover && (
            <motion.p
              key={currHover.name}
              initial={{ opacity: 0, y: -10, position: "absolute" }}
              animate={{ opacity: 1, y: 0, position: "absolute" }}
              exit={{ opacity: 0, y: 10, position: "absolute" }}
              transition={{ duration: 0.2 }}
              className="text-sm text-center w-full"
            >
              {currHover.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {/* {currHover?.name} */}
    </div>
  );
}
