import { Button, Input } from "@dropiq/ui"

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-50/40 px-6">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Input
              className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
              placeholder="Search..."
              type="search"
            />
          </div>
        </form>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </header>
  )
}
