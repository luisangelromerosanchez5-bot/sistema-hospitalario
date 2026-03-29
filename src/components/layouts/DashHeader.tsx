export function DashHeader({ userEmail }: { userEmail?: string }) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-end px-6">
      <span className="text-sm text-gray-600">{userEmail}</span>
    </header>
  );
}