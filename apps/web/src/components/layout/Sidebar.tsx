import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="w-64 flex flex-col border-r bg-gray-50/40 h-full">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span>DropIQ Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/dashboard">Dashboard</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/customers">Customers</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/health-scores">Health Scores</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/predictions">Predictions</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/analytics">Analytics</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/revenue">Revenue</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/automations">Automations</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/ai-copilot">AI Copilot</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/reports">Reports</Link>
          <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/integrations">Integrations</Link>
          <div className="mt-4 border-t pt-4">
             <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/settings">Settings</Link>
             <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/profile">Profile</Link>
             <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/billing">Billing</Link>
             <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100" href="/help">Help</Link>
          </div>
        </nav>
      </div>
    </aside>
  )
}
