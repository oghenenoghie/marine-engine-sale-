export function PageSpinner() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-steel/20 border-t-hull" />
    </div>
  );
}
