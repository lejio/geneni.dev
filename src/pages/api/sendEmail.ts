import type { APIRoute } from "astro";
import { CONTACT_TO_EMAIL, RESEND_API_KEY } from "astro:env/server";
import { Resend } from "resend";
import { verifyTurnstileToken } from "../../lib/turnstile";

export const prerender = false;

const resend = new Resend(RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    const turnstileToken = String(body.turnstileToken ?? "").trim();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const captchaValid = await verifyTurnstileToken(
      turnstileToken,
      clientAddress
    );

    if (!captchaValid) {
      return new Response(
        JSON.stringify({ error: "Captcha verification failed. Please try again." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service is not configured." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const to = CONTACT_TO_EMAIL?.trim() || "delivered@resend.dev";

    const { error } = await resend.emails.send({
      from: "geneni.dev <portfolio@contact.geneni.dev>",
      to: [to],
      replyTo: email,
      subject: `[geneni.dev] ${subject}`,
      html: `
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Unable to send your message right now." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Message sent successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process your request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
