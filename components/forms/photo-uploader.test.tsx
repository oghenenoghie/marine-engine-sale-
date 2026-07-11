import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
vi.mock("next-cloudinary", () => ({
  CldUploadWidget: (props: { children: (args: { open: () => void }) => React.ReactNode }) =>
    props.children({ open: () => {} }),
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
});
