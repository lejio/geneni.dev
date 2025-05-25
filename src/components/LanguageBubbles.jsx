import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BubbleCanvas from "./BubbleCanvas";
import { githubLanguages } from "../lib/stores"; // adjust the path

export default function LanguageBubbles() {
  const [languages, setLanguages] = useState([]);
  const [resizeKey, setResizeKey] = useState(0); // <- for remount trigger
  const IGNORED_LANGUAGES = ["Batchfile", "PowerShell", "Shell", "Cython"];

  useEffect(() => {
    // console.log("Starting worker");
    const worker = new Worker("/fetchWorker.js");
    worker.postMessage({ token: import.meta.env.PUBLIC_GITHUB_TOKEN });

    worker.onmessage = (e) => {
      if (e.data.error) {
        console.error("Worker error:", e.data.error);
      } else if (
        (e.data.partial || e.data.done) &&
        Array.isArray(e.data.langs)
      ) {
        const filtered = e.data.langs
          .filter((d) => !IGNORED_LANGUAGES.includes(d.name))
          .sort((a, b) => b.value - a.value);

        setLanguages(filtered);
        githubLanguages.set(filtered);
      }
    };

    return () => worker.terminate();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setResizeKey((prev) => prev + 1); // trigger remount
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (languages.length === 0)
    return (
      <div className="absolute top-0 left-0 p-5 w-48">
        <AnimatePresence mode="wait">
          <motion.p
            initial={{ opacity: 0, y: -10, position: "absolute" }}
            animate={{ opacity: 1, y: 0, position: "absolute" }}
            exit={{ opacity: 0, y: 10, position: "absolute" }}
            transition={{ duration: 0.2 }}
            className="text-sm text-center w-full"
          >
            Loading bubbles...
          </motion.p>
        </AnimatePresence>
      </div>
    );

  return <BubbleCanvas key={resizeKey} languages={languages} />;
}
