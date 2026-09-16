import { HomeNav } from "@/components/HomeNav";
import { LandingLines } from "@/components/LandingLines";
import { getNavItems } from "@/lib/nav-items";

export default async function Home() {
  const navItems = await getNavItems();

  return (
    <div className="relative flex flex-1">
      <LandingLines />
      {/* Vertically/horizontally centered in the left mid cell; stack left-aligned */}
      <main className="fixed top-[25vh] left-0 z-10 flex h-[50vh] w-[50vw] items-center justify-center px-8">
        <div className="flex flex-col items-start gap-6 text-left">
          <h1 className="text-5xl tracking-tight">Gene Ni</h1>
          <p className="text-lg text-foreground/70">
            Programming, photography, and trading.
          </p>
          <div>
            <HomeNav items={navItems} />
          </div>
        </div>
      </main>
    </div>
  );
}
