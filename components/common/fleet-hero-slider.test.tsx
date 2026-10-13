import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FleetHeroSlider, type FleetHeroSlide } from "./fleet-hero-slider";

// vi.mock calls are hoisted above these imports by vitest's transform.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- stand-in for next/image in jsdom, not shipped code
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
// FadeIn's whileInView needs IntersectionObserver, which jsdom lacks — scroll reveal isn't under test here.
vi.mock("@/components/motion/fade-in", () => ({
  FadeIn: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

const SLIDES: FleetHeroSlide[] = [
  {
    id: "fleet",
    label: "Rental fleet",
    eyebrow: "Marine rental",
    headline: "Charter without limits.",
    body: "Fleet-wide copy.",
    primary: { href: "/rentals#fleet", label: "Browse rental fleet" },
    secondary: { href: "/contact", label: "Request availability" },
  },
  {
    id: "barges",
    label: "Barges",
    eyebrow: "Rental fleet · Barges",
    headline: "Heavy cargo, open deck.",
    body: "Barge copy.",
    primary: { href: "/rentals/barges", label: "View barges" },
    secondary: { href: "/rentals/barges#request-availability", label: "Request availability" },
    drawing: { url: "/rentals/barges.webp" },
  },
  {
    id: "pontoons",
    label: "Pontoons",
    eyebrow: "Rental fleet · Pontoons",
    headline: "A work site on the water.",
    body: "Pontoon copy.",
    primary: { href: "/rentals/pontoons", label: "View pontoons" },
    secondary: { href: "/rentals/pontoons#request-availability", label: "Request availability" },
    drawing: { url: "/rentals/pontoons.webp" },
  },
];

const activeSlide = () =>
  screen.getAllByRole("group", { hidden: true }).find((el) => el.getAttribute("aria-hidden") === "false");

describe("FleetHeroSlider", () => {
  it("renders every slide, with only the first heading as the page h1 and the first slide active", () => {
    render(<FleetHeroSlider slides={SLIDES} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Charter without limits.");
    expect(screen.getAllByRole("heading", { level: 2, hidden: true })).toHaveLength(2);
    expect(activeSlide()).toHaveAttribute("aria-label", "1 of 3: Rental fleet");
    // Drawing layers render for slides with a `drawing` only; the first slide uses the inline SVG fallback instead.
    expect(document.querySelectorAll("img")).toHaveLength(2);
  });

  it("moves between slides with next/previous (wrapping) and the pagination bars", () => {
    render(<FleetHeroSlider slides={SLIDES} />);

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(activeSlide()).toHaveAttribute("aria-label", "2 of 3: Barges");
    expect(screen.getByRole("button", { name: "Show slide 2: Barges" })).toHaveAttribute("aria-current", "true");

    fireEvent.click(screen.getByRole("button", { name: "Show slide 3: Pontoons" }));
    expect(activeSlide()).toHaveAttribute("aria-label", "3 of 3: Pontoons");

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(activeSlide()).toHaveAttribute("aria-label", "1 of 3: Rental fleet");

    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(activeSlide()).toHaveAttribute("aria-label", "3 of 3: Pontoons");
  });

  it("advances when the active progress bar finishes, and the pause button toggles rotation", () => {
    render(<FleetHeroSlider slides={SLIDES} />);

    const bar = screen.getByRole("button", { name: "Show slide 1: Rental fleet" }).querySelector(".animate-slide-progress");
    expect(bar).not.toBeNull();
    // jsdom has no AnimationEvent, so React listens for the prefixed name there (browsers get plain animationend).
    fireEvent(bar!, new Event("webkitAnimationEnd", { bubbles: true }));
    expect(activeSlide()).toHaveAttribute("aria-label", "2 of 3: Barges");

    fireEvent.click(screen.getByRole("button", { name: "Pause slide rotation" }));
    expect(screen.getByRole("button", { name: "Start slide rotation" })).toBeInTheDocument();
    const pausedBar = screen.getByRole("button", { name: "Show slide 2: Barges" }).querySelector<HTMLElement>(".animate-slide-progress");
    expect(pausedBar?.style.animationPlayState).toBe("paused");
  });

  it("renders a single slide without carousel controls", () => {
    render(<FleetHeroSlider slides={SLIDES.slice(0, 1)} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Charter without limits.");
    expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
  });
});
