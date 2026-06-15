/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly TURNSTILE_SECRET_KEY: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly CONTACT_TO_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
