export default function EmptyState({ title = 'No data found', message = 'There is nothing to show here yet.', action = null, icon = null }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <div className="mb-3 text-5xl">{icon || '📭'}</div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
