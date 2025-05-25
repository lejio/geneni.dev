import { type JSX, useRef, useState } from "react";
import { IoMdHome, IoMdRocket, IoMdPerson, IoMdMail } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

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
      name: "Projects",
      href: "/projects",
      color: "#a872f4",
      icon: (
        <IoMdRocket
          size={size}
          className="rotate-45 transition-all duration-300 hover:text-[#a872f4]"
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

  const isExpanded = currHover !== null;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrHover(currentItem); // starts expanded
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setCurrHover(null); // collapse
    }, 500); // delay helps prevent flicker
  };

  return (
    <div
      className="relative mt-5 flex justify-center items-center gap-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        layout
        initial={{ width: 64 }}
        animate={{ width: isExpanded ? 256 : 64 }}
        transition={{ duration: 0.3 }}
        className="h-16 rounded-full bg-white border-2 text-black py-2 flex justify-center items-center overflow-hidden"
        style={{
          borderColor: (currHover ?? currentItem).color,
        }}
      >
        {!isExpanded ? (
          <a
            href={currentItem.href}
            className="flex items-center justify-center min-w-[2rem] h-8"
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

      <AnimatePresence>
        {isExpanded && currHover && (
          <motion.p
            key={currHover.name}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {currHover.name}
          </motion.p>
        )}
      </AnimatePresence>
      {/* {currHover?.name} */}
    </div>
  );
}
