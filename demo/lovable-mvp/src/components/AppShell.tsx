import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Compass, Heart, MessageCircle, User } from "lucide-react";

const NAV = [
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/connections", label: "Connections", icon: Heart },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-demo px-2.5 py-1 text-xs font-medium text-demo-foreground" title="All people shown are fictional demo profiles">
      <span className="h-1.5 w-1.5 rounded-full bg-demo-foreground" aria-hidden /> Demo mode
    </span>
  );
}

export function AppShell({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r md:flex md:flex-col md:gap-8 md:p-6 sticky top-0 h-screen">
        <Link to="/" className="font-display text-2xl">Reveal<span className="text-primary">Me</span></Link>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted !text-foreground font-medium" }}>
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto"><DemoBadge /></div>
      </aside>
      <div className="pb-24 md:pb-10">
        <header className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b bg-background/90 px-5 py-4 backdrop-blur md:px-10">
          <h1 className="truncate text-2xl">{title}</h1>
          <div className="flex items-center gap-2">{action}<span className="md:hidden"><DemoBadge /></span></div>
        </header>
        <main className="mx-auto max-w-2xl px-5 py-6 md:px-10">{children}</main>
      </div>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t bg-card md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground"
            activeProps={{ className: "!text-primary font-medium" }}>
            <Icon className="h-5 w-5" aria-hidden /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}