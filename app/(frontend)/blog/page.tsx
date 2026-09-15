import Link from "next/link";
import type { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Blog | Gene Ni",
  description: "Writing and notes",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const payload = await getPayloadClient();
  const { docs: posts } = await payload.find({
    collection: "posts",
    depth: 0,
    limit: 50,
    sort: "-publishedAt",
    where: {
      _status: {
        equals: "published",
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-8 py-16">
      <header className="mb-12 space-y-3">
        <p className="text-sm text-foreground/60">
          <Link href="/" className="underline underline-offset-4">
            Home
          </Link>
        </p>
        <h1 className="text-4xl tracking-tight">Blog</h1>
        <p className="text-foreground/70">Notes and longer writing.</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-foreground/60">No posts yet.</p>
      ) : (
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="space-y-2">
                <h2 className="text-2xl tracking-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {post.title}
                  </Link>
                </h2>
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
                  <p className="text-foreground/75 max-w-2xl">{post.excerpt}</p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
