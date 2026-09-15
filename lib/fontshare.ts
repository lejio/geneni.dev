import catalog from "./fontshare-catalog.json";

export type FontshareFont = {
  slug: string;
  name: string;
  cssFamily: string;
  category: string;
  fallback: string;
  headingWeight: number;
  bodyWeight: number;
  weights: number[];
};

export const FONTSHARE_FONTS = catalog as FontshareFont[];

export const DEFAULT_HEADING_FONT = "boska";
export const DEFAULT_BODY_FONT = "switzer";

export function getFontBySlug(
  slug: string | null | undefined,
  fallbackSlug: string = DEFAULT_BODY_FONT,
): FontshareFont {
  const found = FONTSHARE_FONTS.find((font) => font.slug === slug);
  if (found) return found;
  return (
    FONTSHARE_FONTS.find((font) => font.slug === fallbackSlug) ??
    FONTSHARE_FONTS[0]
  );
}

export function fontSelectOptions() {
  return FONTSHARE_FONTS.map((font) => ({
    label: `${font.name} (${font.category})`,
    value: font.slug,
  }));
}

/** Build a Fontshare CSS API URL that loads only the requested faces. */
export function buildFontshareCssUrl(
  headingSlug: string,
  bodySlug: string,
): string {
  const heading = getFontBySlug(headingSlug, DEFAULT_HEADING_FONT);
  const body = getFontBySlug(bodySlug, DEFAULT_BODY_FONT);

  if (heading.slug === body.slug) {
    const weights = Array.from(
      new Set([heading.headingWeight, body.bodyWeight]),
    ).sort((a, b) => a - b);
    return `https://api.fontshare.com/v2/css?f[]=${heading.slug}@${weights.join(",")}&display=swap`;
  }

  return `https://api.fontshare.com/v2/css?f[]=${heading.slug}@${heading.headingWeight}&f[]=${body.slug}@${body.bodyWeight}&display=swap`;
}

export function fontFamilyStack(font: FontshareFont): string {
  const quoted = `"${font.cssFamily}"`;
  if (font.fallback === "serif") {
    return `${quoted}, Georgia, "Times New Roman", serif`;
  }
  if (font.fallback === "monospace") {
    return `${quoted}, ui-monospace, SFMono-Regular, Menlo, monospace`;
  }
  return `${quoted}, system-ui, sans-serif`;
}
