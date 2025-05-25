// components/PoppedList.tsx
import { useStore } from "@nanostores/react";
import { poppedLanguages, githubLanguages } from "../lib/stores";
import { motion } from "framer-motion";
import I_Astro from "../images/I_Astro";
import I_C from "../images/I_C";
import I_CPP from "../images/I_CPP";
import I_CSS from "../images/I_CSS";
import I_HTML from "../images/I_HTML";
import I_JS from "../images/I_JS";
import I_Java from "../images/I_Java";
import I_Lua from "../images/I_Lua";
import I_Nix from "../images/I_Nix";
import I_Python from "../images/I_Python";
import I_Ruby from "../images/I_Ruby";
import I_SCSS from "../images/I_SCSS";
import I_Swift from "../images/I_Swift";
import I_TS from "../images/I_TS";

export default function LangPercentage() {
  const langIcons: Record<string, React.FC> = {
    Astro: I_Astro,
    C: I_C,
    "C++": I_CPP,
    CSS: I_CSS,
    HTML: I_HTML,
    JavaScript: I_JS,
    Java: I_Java,
    Lua: I_Lua,
    Nix: I_Nix,
    Python: I_Python,
    Ruby: I_Ruby,
    SCSS: I_SCSS,
    Swift: I_Swift,
    TypeScript: I_TS,
  };

  const popped = useStore(poppedLanguages);
  const gitlang = useStore(githubLanguages);

  if (popped.length === 0) return null;

  const total = gitlang.reduce((sum, lang) => sum + lang.value, 0);
  console.log(total);

  return (
    <div className="md:flex hidden flex-row align-middle items-center pl-5 w-3/4 gap-1">
      {popped.map((lang) => {
        const langData = gitlang.find((l) => l.name === lang);
        const Icon = langIcons[lang];
        const percentage = langData
          ? ((langData.value / total) * 100).toFixed(2)
          : 0;
        const scaleFactor = 5;
        const scaledPercentage = Math.min(
          Number(percentage) * scaleFactor,
          100
        );
        return Icon ? (
          <>
            <div
              key={lang}
              className="flex flex-col items-center align-middle justify-center w-12 h-12"
            >
              <Icon />
            </div>
            <motion.div
              key={`${lang}-bar`}
              className="h-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 rounded"
              initial={{ width: 0 }}
              animate={{ width: `${scaledPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </>
        ) : (
          <span key={lang}>{lang}</span>
        );
      })}
    </div>
  );
}
