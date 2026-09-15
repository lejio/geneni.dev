import type { Metadata } from "next";
import { getSiteTypography } from "@/lib/site-typography";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gene Ni",
  description: "My personal website and blog about my interests, ranging from programming to photography to trading.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const typography = await getSiteTypography();

  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={
        {
          "--font-heading-family": typography.headingFamily,
          "--font-sans-family": typography.bodyFamily,
          "--font-heading-weight": String(typography.headingWeight),
          "--font-body-weight": String(typography.bodyWeight),
        } as React.CSSProperties
      }
    >
      <head>
        <link rel="stylesheet" href={typography.cssUrl} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
