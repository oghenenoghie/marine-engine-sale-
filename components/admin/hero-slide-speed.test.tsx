import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeroSlideSpeed } from "./hero-slide-speed";

// vi.mock calls are hoisted above these imports by vitest's transform.
const saveMock = vi.fn();
vi.mock("@/lib/actions/settings", () => ({
  saveHeroSlideIntervalAction: (...args: unknown[]) => saveMock(...args),
}));

describe("HeroSlideSpeed", () => {
  beforeEach(() => {
    saveMock.mockReset().mockResolvedValue({ ok: true });
  });

  it("saves the entered seconds as a number", async () => {
    render(<HeroSlideSpeed initialSeconds={4} />);

    fireEvent.change(screen.getByLabelText("Seconds per slide"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Save speed" }));

    await waitFor(() => expect(saveMock).toHaveBeenCalledWith(3));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("shows the action's validation error", async () => {
    saveMock.mockResolvedValue({ ok: false, error: "Seconds per slide must be between 2 and 30." });
    render(<HeroSlideSpeed initialSeconds={4} />);

    fireEvent.click(screen.getByRole("button", { name: "Save speed" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("between 2 and 30");
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("reports a failed request instead of spinning forever", async () => {
    saveMock.mockRejectedValue(new Error("network down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<HeroSlideSpeed initialSeconds={4} />);

    fireEvent.click(screen.getByRole("button", { name: "Save speed" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't save");
    expect(screen.getByRole("button", { name: "Save speed" })).toBeEnabled();
  });
});
