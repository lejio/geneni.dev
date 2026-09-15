import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from "@payloadcms/richtext-lexical/react";
import type {
  DefaultNodeTypes,
  SerializedLinkNode,
} from "@payloadcms/richtext-lexical";

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!;
  if (typeof value !== "object" || value === null) {
    return "#";
  }
  const slug = "slug" in value ? String(value.slug) : "";
  if (relationTo === "posts") {
    return `/blog/${slug}`;
  }
  return `/${slug}`;
};

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
});

type Props = {
  data: SerializedEditorState;
  className?: string;
};

export function RichText({ data, className }: Props) {
  return (
    <ConvertRichText
      converters={jsxConverters}
      data={data}
      className={className}
    />
  );
}
