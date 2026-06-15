import type { APIRoute } from "astro";
import { Resend } from "resend";
export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const { data, error } = await resend.emails.send({
    from: "geneni.dev <portfolio@contact.geneni.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello World",
    html: "<strong>It works!</strong>",
  });
  return new Response(
    JSON.stringify({
      message: `${data}`,
    })
  );
};
