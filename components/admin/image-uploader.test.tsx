import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StockImage } from "@/types";

// next/image and next-cloudinary both do real network/DOM work that isn't
// relevant here; stub them so the test isolates our component's own logic.
// The widget mock's `open()` simulates a completed upload by invoking
// onSuccess immediately, so clicking "Upload photos" drives the same
// add-image path a real Cloudinary success callback would.
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
let widgetShouldError = false;
vi.mock("next-cloudinary", () => ({
  CldUploadWidget: (props: {
    children: (args: { open: () => void }) => React.ReactNode;
    onSuccess?: (result: { info: { public_id: string; original_filename?: string } }) => void;
    onError?: (error: unknown) => void;
  }) =>
    props.children({
      open: () =>
        widgetShouldError
          ? props.onError?.("Upload preset not found")
          : props.onSuccess?.({ info: { public_id: "drydock/stock/new1", original_filename: "engine.jpg" } }),
    }),
}));

const sampleImages: StockImage[] = [{ publicId: "drydock/stock/abc123", alt: "Photo", isPrimary: true, type: "photo" }];

describe("ImageUploader", () => {
  beforeEach(() => {
    vi.resetModules();
    widgetShouldError = false;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not render an upload control when NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "");
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={[]} onChange={() => {}} />);

    expect(screen.getByText(/Set/)).toHaveTextContent("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    expect(screen.queryByRole("button", { name: /upload photos/i })).not.toBeInTheDocument();
  });

  it("does not render an upload control when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={[]} onChange={() => {}} />);

    expect(screen.getByText(/Set/)).toHaveTextContent("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
    expect(screen.queryByRole("button", { name: /upload photos/i })).not.toBeInTheDocument();
  });

  it("surfaces the widget's error instead of failing silently", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    widgetShouldError = true;
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={[]} onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /upload photos/i }));

    expect(await screen.findByText(/Upload preset not found/)).toBeInTheDocument();
  });

  it("renders the upload button once the preset is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={[]} onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /upload photos/i })).toBeInTheDocument();
  });

  it("still renders existing images with their bare publicId as the img src", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");

    render(<ImageUploader images={sampleImages} onChange={() => {}} />);

    // Confirms the preview <img> is fed the raw Cloudinary publicId, which
    // only resolves to a real picture once the custom loader (see
    // lib/cloudinary-loader.test.ts) has NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to
    // work with.
    expect(screen.getByAltText("Photo")).toHaveAttribute("src", "drydock/stock/abc123");
  });

  it("adds the uploaded image and marks it primary when the list was empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");
    const onChange = vi.fn();

    render(<ImageUploader images={[]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /upload photos/i }));

    expect(onChange).toHaveBeenCalledWith([
      { publicId: "drydock/stock/new1", alt: "engine.jpg", isPrimary: true, type: "photo" },
    ]);
  });

  it("appends a non-primary image when photos already exist", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");
    const onChange = vi.fn();

    render(<ImageUploader images={sampleImages} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /upload photos/i }));

    expect(onChange).toHaveBeenCalledWith([
      ...sampleImages,
      { publicId: "drydock/stock/new1", alt: "engine.jpg", isPrimary: false, type: "photo" },
    ]);
  });

  it("promotes the next image to primary when the primary photo is removed", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");
    const onChange = vi.fn();
    const twoImages: StockImage[] = [
      { publicId: "a", alt: "A", isPrimary: true, type: "photo" },
      { publicId: "b", alt: "B", isPrimary: false, type: "photo" },
    ];

    render(<ImageUploader images={twoImages} onChange={onChange} />);
    fireEvent.click(screen.getAllByTitle("Remove photo")[0]!);

    expect(onChange).toHaveBeenCalledWith([{ publicId: "b", alt: "B", isPrimary: true, type: "photo" }]);
  });

  it("marks the clicked image as primary and clears the previous flag", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-cloud");
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "drydock-unsigned");
    const { ImageUploader } = await import("./image-uploader");
    const onChange = vi.fn();
    const twoImages: StockImage[] = [
      { publicId: "a", alt: "A", isPrimary: true, type: "photo" },
      { publicId: "b", alt: "B", isPrimary: false, type: "photo" },
    ];

    render(<ImageUploader images={twoImages} onChange={onChange} />);
    fireEvent.click(screen.getAllByTitle("Set as primary photo")[1]!);

    expect(onChange).toHaveBeenCalledWith([
      { publicId: "a", alt: "A", isPrimary: false, type: "photo" },
      { publicId: "b", alt: "B", isPrimary: true, type: "photo" },
    ]);
  });
});
