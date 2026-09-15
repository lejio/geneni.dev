import type { GlobalConfig } from "payload";
import {
  DEFAULT_BODY_FONT,
  DEFAULT_HEADING_FONT,
  fontSelectOptions,
} from "../lib/fontshare";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "typography",
      type: "group",
      label: "Typography",
      fields: [
        {
          name: "headingFont",
          type: "select",
          label: "Heading font",
          required: true,
          defaultValue: DEFAULT_HEADING_FONT,
          options: fontSelectOptions(),
          admin: {
            description:
              "Fontshare family used for h1–h3. Only this face (plus body) is loaded on the public site.",
          },
        },
        {
          name: "bodyFont",
          type: "select",
          label: "Body font",
          required: true,
          defaultValue: DEFAULT_BODY_FONT,
          options: fontSelectOptions(),
          admin: {
            description:
              "Fontshare family used for body text. Only this face (plus heading) is loaded on the public site.",
          },
        },
      ],
    },
  ],
};
