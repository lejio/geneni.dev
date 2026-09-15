import { getPayloadClient } from "@/lib/payload";
import {
  DEFAULT_BODY_FONT,
  DEFAULT_HEADING_FONT,
  buildFontshareCssUrl,
  fontFamilyStack,
  getFontBySlug,
} from "@/lib/fontshare";

export type SiteTypography = {
  headingFont: string;
  bodyFont: string;
  cssUrl: string;
  headingFamily: string;
  bodyFamily: string;
  headingWeight: number;
  bodyWeight: number;
};

export async function getSiteTypography(): Promise<SiteTypography> {
  let headingSlug = DEFAULT_HEADING_FONT;
  let bodySlug = DEFAULT_BODY_FONT;

  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
    });
    headingSlug =
      settings?.typography?.headingFont || DEFAULT_HEADING_FONT;
    bodySlug = settings?.typography?.bodyFont || DEFAULT_BODY_FONT;
  } catch {
    // Fall back to defaults when DB is unavailable (e.g. local without Neon).
  }

  const heading = getFontBySlug(headingSlug, DEFAULT_HEADING_FONT);
  const body = getFontBySlug(bodySlug, DEFAULT_BODY_FONT);

  return {
    headingFont: heading.slug,
    bodyFont: body.slug,
    cssUrl: buildFontshareCssUrl(heading.slug, body.slug),
    headingFamily: fontFamilyStack(heading),
    bodyFamily: fontFamilyStack(body),
    headingWeight: heading.headingWeight,
    bodyWeight: body.bodyWeight,
  };
}
