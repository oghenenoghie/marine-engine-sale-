export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return src;
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}/${src}`;
}
