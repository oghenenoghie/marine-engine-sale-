import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HeroSlide } from "@/lib/data/settings";
import { HeroSlidesEditor } from "./hero-slides-editor";

// vi.mock calls are hoisted above these imports by vitest's transform.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- stand-in for next/image in jsdom, not shipped code
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
vi.mock("@/lib/supabase/client", () => ({ createClient: vi.fn() }));
const saveHeroSlidesAction = vi.fn(async (_slides: HeroSlide[]) => ({ ok: true as const }));
vi.mock("@/lib/actions/settings", () => ({
  saveHeroSlidesAction: (slides: HeroSlide[]) => saveHeroSlidesAction(slides),
}));

const slide: HeroSlide = {
  id: "s1",
  eyebrow: "Marine diesel",
  headline: "Trading the fleet.",
  body: "Engines and parts.",
  primaryHref: "/parts",
  primaryLabel: "Browse parts",
  secondaryHref: "/rentals",
  secondaryLabel: "Browse rental fleet",
  backgroundImage: "",
  drawingUrl: "",
  drawingCaption: "",
};

describe("HeroSlidesEditor drawing picker", () => {
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co"));
  afterEach(() => {
    vi.unstubAllEnvs();
    saveHeroSlidesAction.mockClear();
  });

  it("offers the rental category drawings, one option per shared drawing", () => {
    render(<HeroSlidesEditor initial={[slide]} />);

    const select = screen.getByLabelText("Technical drawing");
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
    expect(options[0]).toBe("None — animated placeholder");
    expect(options).toContain("Yachts");
    expect(options).toContain("FPSO Vessels / Bunkering Tankers");
  });

  it("uses the picked category drawing, clears the old caption, then saves it", async () => {
    render(<HeroSlidesEditor initial={[{ ...slide, drawingUrl: "/rentals/barges.webp", drawingCaption: "Barge" }]} />);

    fireEvent.change(screen.getByLabelText("Technical drawing"), { target: { value: "/rentals/yachts.webp" } });
    expect(document.querySelector('img[src="/rentals/yachts.webp"]')).not.toBeNull();
    expect(screen.getByLabelText("Drawing caption")).toHaveValue("");

    fireEvent.click(screen.getByRole("button", { name: "Save hero slides" }));
    await waitFor(() => expect(saveHeroSlidesAction).toHaveBeenCalledTimes(1));
    expect(saveHeroSlidesAction.mock.calls[0]![0][0]).toMatchObject({
      drawingUrl: "/rentals/yachts.webp",
      drawingCaption: "",
    });
  });

  it("keeps a drawing uploaded before the picker selectable", () => {
    const uploaded = "https://proj.supabase.co/storage/v1/object/public/site-images/drydock/hero-slides/a.png";
    render(<HeroSlidesEditor initial={[{ ...slide, drawingUrl: uploaded }]} />);

    expect(screen.getByLabelText("Technical drawing")).toHaveValue(uploaded);
    expect(screen.getByRole("option", { name: "Custom image (uploaded earlier)" })).toBeInTheDocument();
  });
});
