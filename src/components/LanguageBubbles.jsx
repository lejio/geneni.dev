import { useEffect, useState } from "react";
import BubbleCanvas from "./BubbleCanvas";

export default function LanguageBubbles() {
  const [languages, setLanguages] = useState([]);
  const [resizeKey, setResizeKey] = useState(0); // <- for remount trigger

  useEffect(() => {
    // console.log("Starting worker");
    const worker = new Worker("/fetchWorker.js");
    worker.postMessage({ token: import.meta.env.PUBLIC_GITHUB_TOKEN });

    worker.onmessage = (e) => {
      if (e.data.error) {
        console.error("Worker error:", e.data.error);
      } else if (e.data.partial && e.data.langs) {
        const partialLangs = Object.entries(e.data.langs)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }));
        setLanguages(partialLangs);
      } else if (e.data.done && e.data.langs) {
        const finalLangs = e.data.langs;
        setLanguages(finalLangs);
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

  if (languages.length === 0) return <div>Loading bubbles...</div>;

  return <BubbleCanvas key={resizeKey} languages={languages} />;
}
