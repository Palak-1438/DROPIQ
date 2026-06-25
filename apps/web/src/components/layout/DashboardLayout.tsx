import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
