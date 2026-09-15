import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText } from "@/components/RichText";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

type Args = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    depth: 2,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: "published" } },
      ],
    },
  });
  return docs[0] ?? null;
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Post not found | Gene Ni" };
  }
  return {
    title: `${post.title} | Gene Ni`,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const hero =
    post.heroImage && typeof post.heroImage === "object"
      ? post.heroImage
      : null;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-8 py-16">
      <p className="mb-8 text-sm text-foreground/60">
        <Link href="/blog" className="underline underline-offset-4">
          Blog
        </Link>
      </p>

      <article className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl tracking-tight sm:text-5xl">{post.title}</h1>
          {post.publishedAt ? (
            <time
              dateTime={post.publishedAt}
              className="block text-sm text-foreground/55"
            >
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          ) : null}
          {post.excerpt ? (
            <p className="text-lg text-foreground/70">{post.excerpt}</p>
          ) : null}
        </header>

        {hero?.url ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={hero.url}
              alt={hero.alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}

        {post.content ? (
          <div className="space-y-4 text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:text-2xl [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
            <RichText data={post.content as SerializedEditorState} />
          </div>
        ) : null}
      </article>
    </main>
  );
}
