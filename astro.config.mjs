// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: vercel(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret' }),
      CONTACT_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_GITHUB_TOKEN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
});