import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Drydock is a B2B trading platform for marine diesel engines and spare parts.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <span className="label text-blueprint">About</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Findability and trust.</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-relaxed text-steel">
        <p>
          Drydock trades complete marine diesel engines and spare parts — Wärtsilä, MAN, MaK, Deutz and Caterpillar —
          for owners, operators and shipyards. The parts market is crowded with vendors selling near-identical
          inventory out of similar warehouses; what separates them online is findability and trust.
        </p>
        <p>
          We built our catalog around three ideas: parts should be findable by pointing at the exploded diagram they
          actually belong to, not just by category; condition photography should be honest and thorough, because
          used parts sell on trust; and search should work the way engineers actually search — by OEM part number.
        </p>
        <p>Based in Dordrecht, at the heart of the Rotterdam maritime cluster.</p>
      </div>
    </div>
  );
}
