import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The widget mock's `open()` simulates a completed upload by invoking
// onSuccess immediately, so clicking "Add photos" drives the same
// append-id path a real Cloudinary success callback would.
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
vi.mock("next-cloudinary", () => ({
  CldUploadWidget: (props: {
    children: (args: { open: () => void }) => React.ReactNode;
    onSuccess?: (result: { info: { public_id: string } }) => void;
  }) => props.children({ open: () => props.onSuccess?.({ info: { public_id: "drydock/sell-enquiries/new1" } }) }),
}));

describe("PhotoUploader", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falls back to a plain-text notice when the upload preset is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "");
    const { PhotoUploader } = await import("./photo-uploader");

    render(<PhotoUploader publicIds={[]} onChange={() => {}} />);

    expect(screen.getByText(/Photo upload is not configured yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add photos/i })).not.toBeInTheDocument();
  });

  it("renders the add-photos button once the preset is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { PhotoUploader } = await import("./photo-uploader");

    render(<PhotoUploader publicIds={[]} onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /add photos/i })).toBeInTheDocument();
  });

  it("appends the uploaded public id when the upload widget succeeds", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { PhotoUploader } = await import("./photo-uploader");
    const onChange = vi.fn();

    render(<PhotoUploader publicIds={["existing-id"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /add photos/i }));

    expect(onChange).toHaveBeenCalledWith(["existing-id", "drydock/sell-enquiries/new1"]);
  });

  it("lets the seller remove an already-uploaded photo", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { PhotoUploader } = await import("./photo-uploader");
    const onChange = vi.fn();

    render(<PhotoUploader publicIds={["keep-me", "remove-me"]} onChange={onChange} />);
    // Per-photo remove buttons render before "Add photos" in the DOM, so
    // index 0 is the remove control for the first photo, "keep-me".
    fireEvent.click(screen.getAllByRole("button")[0]!);

    expect(onChange).toHaveBeenCalledWith(["remove-me"]);
  });
});
