import { TURNSTILE_SECRET_KEY } from "astro:env/server";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  if (!TURNSTILE_SECRET_KEY) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }

  if (!token) return false;

  const body: Record<string, string> = {
    secret: TURNSTILE_SECRET_KEY,
    response: token,
  };

  if (remoteIp) {
    body.remoteip = remoteIp;
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    console.error("Turnstile siteverify request failed:", response.status);
    return false;
  }

  const result = (await response.json()) as TurnstileVerifyResponse;

  if (!result.success) {
    console.error("Turnstile verification failed:", result["error-codes"]);
  }

  return result.success;
}
