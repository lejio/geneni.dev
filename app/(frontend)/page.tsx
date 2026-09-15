import { HomeNav } from "@/components/HomeNav";
import { getNavItems } from "@/lib/nav-items";

export default async function Home() {
  const navItems = await getNavItems();

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full max-w-3xl flex-col justify-center gap-6 px-8 py-24">
        <h1 className="text-5xl tracking-tight">Gene Ni</h1>
        <p className="text-lg text-foreground/70 max-w-xl">
          Programming, photography, and trading.
        </p>
        <div>
          <HomeNav items={navItems} />
        </div>
      </main>
    </div>
  );
}
