export default function DashboardFolders({ folders = [] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-100"
        >
          {folder.name}
        </button>
      ))}
    </div>
  );
}