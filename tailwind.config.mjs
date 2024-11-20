/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'zerox': ['ZeroxProtoNerdFont', ...defaultTheme.fontFamily.sans],
				// 'zeroxmono': ['ZeroxProtoNerdFontMono', ...defaultTheme.fontFamily.mono],
				// 'zeroxpropo': ['ZeroxProtoNerdFontPropo', ...defaultTheme.fontFamily.serif],
			}
		},
	},
	plugins: [],
}
