export default function DashboardFolders({ folders = [] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-800"
        >
          {folder.name}
        </button>
      ))}
    </div>
  );
}