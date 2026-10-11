import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { stockSeed } from "@/lib/data/stock.seed";
import { RENTAL_DRAWINGS } from "@/lib/data/rentals";
import { StockCard } from "./stock-card";
import type { StockItemView } from "@/types";

// vi.mock calls are hoisted above these imports by vitest's transform.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- stand-in for next/image in jsdom, not shipped code
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));

// Only the fields StockCard reads beyond the stock item itself.
const base = {
  ...stockSeed[0]!,
  brand: { name: "Wärtsilä" },
  category: { slug: "turbochargers" },
} as StockItemView;

describe("StockCard", () => {
  it("shows the item's primary uploaded photo when it has one", () => {
    const item: StockItemView = {
      ...base,
      images: [
        { url: "https://proj.supabase.co/storage/v1/object/public/stock-photos/side.jpg", alt: "Side", type: "photo" },
        { url: "https://proj.supabase.co/storage/v1/object/public/stock-photos/front.jpg", alt: "Front", type: "photo", isPrimary: true },
      ],
    };
    render(<StockCard item={item} />);

    expect(screen.getByRole("img", { name: "Front" })).toHaveAttribute("src", item.images[1]!.url);
  });

  it("falls back to a rental fleet drawing (decorative) when the item has no photo", () => {
    render(<StockCard item={{ ...base, images: [] }} />);

    const img = document.querySelector("img");
    expect(img).not.toBeNull();
    expect(RENTAL_DRAWINGS).toContain(img!.getAttribute("src"));
    expect(img).toHaveAttribute("alt", "");
  });

  it("picks the same stand-in drawing for the same item every render", () => {
    const { unmount } = render(<StockCard item={{ ...base, images: [] }} />);
    const first = document.querySelector("img")!.getAttribute("src");
    unmount();
    render(<StockCard item={{ ...base, images: [] }} />);

    expect(document.querySelector("img")!.getAttribute("src")).toBe(first);
  });
});
