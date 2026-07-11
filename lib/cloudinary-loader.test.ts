import { afterEach, describe, expect, it, vi } from "vitest";
import cloudinaryLoader from "./cloudinary-loader";

describe("cloudinaryLoader", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the bare publicId when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "");

    const src = cloudinaryLoader({ src: "drydock/stock/abc123", width: 400 });

    // This is the actual bug: next/image renders <img src="drydock/stock/abc123">,
    // a relative path with no matching route, so the browser shows a broken image.
    expect(src).toBe("drydock/stock/abc123");
    expect(src.startsWith("http")).toBe(false);
  });

  it("builds a resolvable Cloudinary delivery URL when the cloud name is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-demo");

    const src = cloudinaryLoader({ src: "drydock/stock/abc123", width: 400, quality: 80 });

    expect(src).toBe(
      "https://res.cloudinary.com/drydock-demo/image/upload/f_auto,c_limit,w_400,q_80/drydock/stock/abc123",
    );
  });

  it("defaults quality to auto when none is supplied", () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "drydock-demo");

    const src = cloudinaryLoader({ src: "drydock/stock/abc123", width: 200 });

    expect(src).toContain("q_auto");
  });
});
