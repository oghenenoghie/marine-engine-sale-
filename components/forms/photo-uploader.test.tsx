import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PhotoUploader } from "./photo-uploader";

// vi.mock calls are hoisted above these imports by vitest's transform.
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

describe("PhotoUploader", () => {
  beforeEach(() => {
    uploadMock.mockReset().mockResolvedValue({ error: null });
    getPublicUrlMock
      .mockReset()
      .mockReturnValue({ data: { publicUrl: "https://proj.supabase.co/storage/v1/object/public/sell-photos/new1.jpg" } });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falls back to a plain-text notice when Supabase isn't configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");

    render(<PhotoUploader photoUrls={[]} onChange={() => {}} />);

    expect(screen.getByText(/Photo upload is not configured yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add photos/i })).not.toBeInTheDocument();
  });

  it("renders the add-photos button once Supabase is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");

    render(<PhotoUploader photoUrls={[]} onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /add photos/i })).toBeInTheDocument();
  });

  it("uploads a selected file to Supabase Storage and appends its public URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();

    const { container } = render(<PhotoUploader photoUrls={["existing-url"]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith([
      "existing-url",
      "https://proj.supabase.co/storage/v1/object/public/sell-photos/new1.jpg",
    ]));
    expect(uploadMock).toHaveBeenCalledTimes(1);
  });

  it("shows an error and does not call onChange when the upload fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    uploadMock.mockResolvedValue({ error: { message: "network down" } });
    const onChange = vi.fn();

    const { container } = render(<PhotoUploader photoUrls={[]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => expect(screen.getByText(/upload failed/i)).toBeInTheDocument());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects a disallowed file type before uploading", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();

    const { container } = render(<PhotoUploader photoUrls={[]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("doc.pdf", "application/pdf")] } });

    expect(await screen.findByText(/must be JPG, PNG, WEBP or HEIC/i)).toBeInTheDocument();
    expect(uploadMock).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("lets the seller remove an already-uploaded photo", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
    const onChange = vi.fn();

    render(<PhotoUploader photoUrls={["keep-me", "remove-me"]} onChange={onChange} />);
    // Per-photo remove buttons render before "Add photos" in the DOM, so
    // index 0 is the remove control for the first photo, "keep-me".
    fireEvent.click(screen.getAllByRole("button")[0]!);

    expect(onChange).toHaveBeenCalledWith(["remove-me"]);
  });
});
