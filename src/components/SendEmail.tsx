import { useEffect, useRef, useState } from "react";

type SendEmailProps = {
  siteKey: string;
};

type FormState = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const inputClassName =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";

async function waitForTurnstile() {
  if (window.turnstile) return window.turnstile;

  return new Promise<NonNullable<Window["turnstile"]>>((resolve) => {
    const interval = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(interval);
        resolve(window.turnstile);
      }
    }, 50);
  });
}

export default function SendEmail({ siteKey }: SendEmailProps) {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;

    let cancelled = false;

    const mountTurnstile = async () => {
      const turnstile = await waitForTurnstile();
      if (cancelled || !turnstileRef.current) return;

      if (widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      widgetIdRef.current = turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        theme: "auto",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    mountTurnstile();
    document.addEventListener("astro:page-load", mountTurnstile);

    return () => {
      cancelled = true;
      document.removeEventListener("astro:page-load", mountTurnstile);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  const handleSubmit = async (event: { preventDefault: () => void; currentTarget: any; }) => {
    event.preventDefault();
    setErrorMessage("");

    if (!turnstileToken) {
      setFormState("error");
      setErrorMessage("Please complete the captcha before sending.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      setFormState("error");
      setErrorMessage("Please fill out every field.");
      return;
    }

    setFormState("submitting");

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          turnstileToken,
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to send your message.");
      }

      setFormState("success");
      form.reset();
      setTurnstileToken("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send your message."
      );
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={formState === "submitting"}
          className={inputClassName}
          placeholder="Your name"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={formState === "submitting"}
          className={inputClassName}
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          disabled={formState === "submitting"}
          className={inputClassName}
          placeholder="Subject"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          disabled={formState === "submitting"}
          className={`${inputClassName} resize-y min-h-[120px]`}
          placeholder="Your message"
        />
      </div>

      {siteKey ? (
        <div ref={turnstileRef} className="min-h-[65px]" />
      ) : (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Captcha is not configured. Add PUBLIC_TURNSTILE_SITE_KEY to your environment.
        </p>
      )}

      {formState === "success" && (
        <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          Message sent. Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      )}

      {formState === "error" && errorMessage && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting" || !siteKey}
        className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {formState === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
