import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StockImage } from "@/types";

// next/image and next-cloudinary both do real network/DOM work that isn't
// relevant here; stub them so the test isolates our component's own logic.
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
vi.mock("next-cloudinary", () => ({
  CldUploadWidget: (props: { children: (args: { open: () => void }) => React.ReactNode }) =>
    props.children({ open: () => {} }),
}));

const sampleImages: StockImage[] = [{ publicId: "drydock/stock/abc123", alt: "Photo", isPrimary: true, type: "photo" }];

describe("ImageUploader", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not render an upload control when NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "");
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={[]} onChange={() => {}} />);

    expect(screen.getByText(/Set/)).toHaveTextContent("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    expect(screen.queryByRole("button", { name: /upload photos/i })).not.toBeInTheDocument();
  });

  it("renders the upload button once the preset is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={[]} onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /upload photos/i })).toBeInTheDocument();
  });

  it("still renders existing images with their bare publicId as the img src", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={sampleImages} onChange={() => {}} />);

    // Confirms the preview <img> is fed the raw Cloudinary publicId, which
    // only resolves to a real picture once the custom loader (see
    // lib/cloudinary-loader.test.ts) has NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to
    // work with.
    expect(screen.getByAltText("Photo")).toHaveAttribute("src", "drydock/stock/abc123");
  });
});
