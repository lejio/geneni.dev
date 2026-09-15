import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full max-w-3xl flex-col justify-center gap-6 px-8 py-24">
        <h1 className="text-5xl tracking-tight">Gene Ni</h1>
        <p className="text-lg text-foreground/70 max-w-xl">
          Programming, photography, and trading.
        </p>
        <p>
          <Link
            href="/blog"
            className="underline underline-offset-4 hover:text-foreground/80"
          >
            Read the blog
          </Link>
        </p>
      </main>
    </div>
  );
}
