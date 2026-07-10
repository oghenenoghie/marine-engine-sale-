import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="label text-signal">404</span>
      <h1 className="mt-2 font-display text-xl font-bold text-hull">Page not found</h1>
      <p className="mt-2 text-[13px] text-steel">The item you&apos;re looking for isn&apos;t here.</p>
      <Link href="/" className="mt-5 rounded-md bg-hull px-4 py-2 text-[13px] font-semibold text-paper hover:opacity-90">
        Back to home
      </Link>
    </div>
  );
}
