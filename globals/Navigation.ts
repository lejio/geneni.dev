import type { GlobalConfig } from "payload";
import { BADGE_OPTIONS } from "../lib/nav-constants";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Nav items",
      labels: {
        singular: "Nav Item",
        plural: "Nav Items",
      },
      admin: {
        description:
          "Ordered list for the full-page nav menu. Drag to reorder. Leave link empty for items that are not live yet.",
        initCollapsed: false,
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Menu title",
          required: true,
          admin: {
            description: "Shown in the left nav list.",
          },
        },
        {
          name: "detailTitle",
          type: "text",
          label: "Detail title",
          required: true,
          admin: {
            description: "Heading shown above the description when selected.",
          },
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          admin: {
            description: "Body copy in the detail panel when this item is selected.",
          },
        },
        {
          name: "href",
          type: "text",
          label: "Link",
          admin: {
            description:
              "Internal path or full URL (e.g. /blog). Leave blank if the page is not ready.",
          },
        },
        {
          name: "badge",
          type: "select",
          options: [...BADGE_OPTIONS],
          admin: {
            description: "Optional status label in the detail panel (Coming soon, New, …).",
            isClearable: true,
          },
        },
      ],
    },
  ],
};
