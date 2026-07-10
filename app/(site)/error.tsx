"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="label text-signal">Something broke</span>
      <h2 className="mt-2 font-display text-xl font-bold text-hull">This page hit a snag.</h2>
      <p className="mt-2 text-[13px] text-steel">Try again, or head back to the homepage.</p>
      <button
        onClick={reset}
        className="mt-5 rounded-md bg-hull px-4 py-2 text-[13px] font-semibold text-paper hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
