import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Shipcove Trading is a B2B trading platform for marine diesel engines and spare parts.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <span className="label text-blueprint">About</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Findability and trust.</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-relaxed text-steel">
        <p>
          Shipcove Trading trades complete marine diesel engines and spare parts — Wärtsilä, MAN, MaK, Deutz and Caterpillar —
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

      <div className="mt-10 space-y-8 border-t border-steel/15 pt-10">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-hull">Save time, at the right price</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-steel">
            If it&apos;s not already in stock, we know where to find it fast. Our team&apos;s experience buying and
            selling used marine diesel engines, generator sets, gearboxes and their parts means we can help you get
            the right unit, at the right time, at the right price.
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-hull">Customer satisfaction, priority number one</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-steel">
            Customers keep coming back because we listen and act on what they need. Our sales team gives technical
            and practical advice, not just a spec sheet — and that includes handling the formalities. Exporting
            outside your home market, customs clearance included, shouldn&apos;t be your problem to solve alone.
          </p>
        </div>
      </div>
    </div>
  );
}
