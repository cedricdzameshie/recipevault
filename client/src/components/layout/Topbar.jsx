export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-300/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-rv-plum" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-rv-plum">
              RecipeVault
            </h1>
            <p className="hidden text-xs uppercase tracking-[0.16em] text-stone-500 sm:block">
              Baking workflow
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}