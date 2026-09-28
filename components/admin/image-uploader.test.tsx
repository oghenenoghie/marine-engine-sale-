import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StockImage } from "@/types";
import { ImageUploader } from "./image-uploader";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- stand-in for next/image in jsdom, not shipped code
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));

const uploadMock = vi.fn();
const getPublicUrlMock = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    storage: {
      from: () => ({ upload: uploadMock, getPublicUrl: getPublicUrlMock }),
    },
  }),
}));

function makeFile(name = "engine.jpg", type = "image/jpeg") {
  return new File(["fake-bytes"], name, { type });
}

const sampleImages: StockImage[] = [{ url: "https://proj.supabase.co/storage/v1/object/public/stock-photos/abc123.jpg", alt: "Photo", isPrimary: true, type: "photo" }];

describe("ImageUploader", () => {
  beforeEach(() => {
    uploadMock.mockReset().mockResolvedValue({ error: null });
    getPublicUrlMock
      .mockReset()
      .mockReturnValue({ data: { publicUrl: "https://proj.supabase.co/storage/v1/object/public/stock-photos/new1.jpg" } });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not render an upload control when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");

    render(<ImageUploader images={[]} onChange={() => {}} />);

    expect(screen.getByText(/NEXT_PUBLIC_SUPABASE_URL/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /upload photos/i })).not.toBeInTheDocument();
  });

  it("renders the upload button once Supabase is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");

    render(<ImageUploader images={[]} onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /upload photos/i })).toBeInTheDocument();
  });

  it("still renders existing images with their public URL as the img src", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");

    render(<ImageUploader images={sampleImages} onChange={() => {}} />);

    expect(screen.getByAltText("Photo")).toHaveAttribute(
      "src",
      "https://proj.supabase.co/storage/v1/object/public/stock-photos/abc123.jpg",
    );
  });

  it("uploads a selected file to Supabase Storage, adding it and marking it primary when the list was empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();

    const { container } = render(<ImageUploader images={[]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith([
        { url: "https://proj.supabase.co/storage/v1/object/public/stock-photos/new1.jpg", alt: "engine.jpg", isPrimary: true, type: "photo" },
      ]),
    );
    expect(uploadMock).toHaveBeenCalledTimes(1);
  });

  it("appends a non-primary image when photos already exist", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();

    const { container } = render(<ImageUploader images={sampleImages} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith([
        ...sampleImages,
        { url: "https://proj.supabase.co/storage/v1/object/public/stock-photos/new1.jpg", alt: "engine.jpg", isPrimary: false, type: "photo" },
      ]),
    );
  });

  it("shows an error and does not call onChange when the upload fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    uploadMock.mockResolvedValue({ error: { message: "network down" } });
    const onChange = vi.fn();

    const { container } = render(<ImageUploader images={[]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => expect(screen.getByText(/upload failed/i)).toBeInTheDocument());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects a disallowed file type before uploading", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();

    const { container } = render(<ImageUploader images={[]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("doc.pdf", "application/pdf")] } });

    expect(await screen.findByText(/must be JPG, PNG, WEBP or HEIC/i)).toBeInTheDocument();
    expect(uploadMock).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("promotes the next image to primary when the primary photo is removed", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();
    const twoImages: StockImage[] = [
      { url: "a", alt: "A", isPrimary: true, type: "photo" },
      { url: "b", alt: "B", isPrimary: false, type: "photo" },
    ];

    render(<ImageUploader images={twoImages} onChange={onChange} />);
    fireEvent.click(screen.getAllByTitle("Remove photo")[0]!);

    expect(onChange).toHaveBeenCalledWith([{ url: "b", alt: "B", isPrimary: true, type: "photo" }]);
  });

  it("marks the clicked image as primary and clears the previous flag", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();
    const twoImages: StockImage[] = [
      { url: "a", alt: "A", isPrimary: true, type: "photo" },
      { url: "b", alt: "B", isPrimary: false, type: "photo" },
    ];

    render(<ImageUploader images={twoImages} onChange={onChange} />);
    fireEvent.click(screen.getAllByTitle("Set as primary photo")[1]!);

    expect(onChange).toHaveBeenCalledWith([
      { url: "a", alt: "A", isPrimary: false, type: "photo" },
      { url: "b", alt: "B", isPrimary: true, type: "photo" },
    ]);
  });
});
