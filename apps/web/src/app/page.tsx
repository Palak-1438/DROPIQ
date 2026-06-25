import Link from "next/link";
import { Button } from "@dropiq/ui";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center px-4 md:px-6 bg-white border-b">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl tracking-tight text-blue-600">DropIQ</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  SaaS Foundation, Built for Scale.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Deploy your next enterprise SaaS platform in minutes. Pre-configured with Next.js, NestJS, Tailwind, and Prisma.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg">Start Building Today</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold">Monorepo Ready</h3>
                <p className="text-gray-500">Turborepo setup with shared packages.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold">Type Safe</h3>
                <p className="text-gray-500">End-to-end TypeScript support.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold">UI Library</h3>
                <p className="text-gray-500">Accessible components using Radix UI.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <p className="text-xs text-gray-500">© 2024 DropIQ. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
