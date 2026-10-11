import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_HERO_SLIDER, type HeroSliderSettings } from "@/lib/data/hero-slides";
import { HeroSliderEditor } from "./hero-slider-editor";

// vi.mock calls are hoisted above these imports by vitest's transform.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- stand-in for next/image in jsdom, not shipped code
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));

const saveMock = vi.fn();
const resetMock = vi.fn();
vi.mock("@/lib/actions/settings", () => ({
  saveHeroSliderAction: (...args: unknown[]) => saveMock(...args),
  resetHeroSliderAction: (...args: unknown[]) => resetMock(...args),
}));
vi.mock("@/lib/supabase/client", () => ({ createClient: vi.fn() }));

const INITIAL: HeroSliderSettings = {
  intervalSeconds: 4,
  slides: [
    {
      id: "one",
      label: "First",
      eyebrow: "",
      headline: "First headline.",
      body: "",
      primary: { label: "Go", href: "/rentals" },
      secondary: { label: "", href: "" },
    },
    {
      id: "two",
      label: "Second",
      eyebrow: "",
      headline: "Second headline.",
      body: "",
      primary: { label: "Go", href: "/contact" },
      secondary: { label: "", href: "" },
      image: "/rentals/barges.webp",
    },
  ],
};

describe("HeroSliderEditor", () => {
  beforeEach(() => {
    saveMock.mockReset().mockResolvedValue({ ok: true });
    resetMock.mockReset().mockResolvedValue({ ok: true });
  });

  it("saves edited copy, new order and speed in one payload", async () => {
    render(<HeroSliderEditor initial={INITIAL} />);

    fireEvent.change(screen.getByLabelText("Headline"), { target: { value: "Edited headline." } });
    fireEvent.click(screen.getByRole("button", { name: "Move slide 2 up" }));
    fireEvent.change(screen.getByLabelText("Seconds per slide"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Save slider" }));

    await waitFor(() => expect(saveMock).toHaveBeenCalledTimes(1));
    const payload = saveMock.mock.calls[0]![0] as HeroSliderSettings;
    expect(payload.intervalSeconds).toBe(3);
    expect(payload.slides.map((s) => s.id)).toEqual(["two", "one"]);
    expect(payload.slides[1]!.headline).toBe("Edited headline.");
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("shows the action's validation error instead of claiming success", async () => {
    saveMock.mockResolvedValue({ ok: false, error: "Slide 1: headline is required." });
    render(<HeroSliderEditor initial={INITIAL} />);

    fireEvent.change(screen.getByLabelText("Headline"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Save slider" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Slide 1: headline is required.");
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("reports a failed request instead of spinning forever", async () => {
    saveMock.mockRejectedValue(new Error("network down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<HeroSliderEditor initial={INITIAL} />);

    fireEvent.change(screen.getByLabelText("Seconds per slide"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Save slider" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't save");
    expect(screen.getByRole("button", { name: "Save slider" })).toBeEnabled();
  });

  it("adds and removes slides, but never the last one", () => {
    render(<HeroSliderEditor initial={{ ...INITIAL, slides: INITIAL.slides.slice(0, 1) }} />);

    expect(screen.getByRole("button", { name: "Remove slide 1" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Add slide/ }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Remove slide 2" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("restores the default slides after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<HeroSliderEditor initial={INITIAL} />);

    fireEvent.click(screen.getByRole("button", { name: /Restore defaults/ }));

    await waitFor(() => expect(resetMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("Defaults restored")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(DEFAULT_HERO_SLIDER.slides.length);
  });
});
