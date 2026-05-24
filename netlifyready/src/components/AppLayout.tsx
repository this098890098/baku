import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard, Target, Search, ShieldCheck, Link2, Sparkles,
  CheckSquare, Megaphone, FileBarChart, Users, Settings as SettingsIcon, Menu, X, Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: Target },
  { to: "/keywords", label: "Keywords", icon: Search },
  { to: "/audits", label: "Site Audits", icon: ShieldCheck },
  { to: "/backlinks", label: "Backlinks", icon: Link2 },
  { to: "/competitors", label: "Competitors", icon: Sparkles },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/campaigns", label: "Ads Campaigns", icon: Megaphone },
  { to: "/reports", label: "Reports", icon: FileBarChart },
];

const admin = [
  { to: "/users", label: "Users & Roles", icon: Users },
  { to: "/settings", label: "System Settings", icon: SettingsIcon },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const brand = useStore((s) => s.settings.brand);
  const owner = useStore((s) => s.settings.ownerName);
  const ownerAvatar = useStore((s) => s.settings.ownerAvatar);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const Item = ({ to, label, icon: Icon }: { to: string; label: string; icon: any }) => {
    const active = to === "/" ? path === "/" : path.startsWith(to);
    return (
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground/70 hover:bg-accent hover:text-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
              {brand.slice(0, 1)}
            </div>
            <span className="text-lg font-bold tracking-tight">{brand}</span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-6">
          {nav.map((n) => <Item key={n.to} {...n} />)}
          <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Administration
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {admin.map((n) => <Item key={n.to} {...n} />)}
          </div>
        </nav>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects, keywords, tasks..." className="pl-9 rounded-full bg-muted border-transparent" />
          </div>
          <button className="relative rounded-full p-2 hover:bg-accent" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="hidden h-9 items-center gap-2 rounded-full bg-muted px-3 sm:flex">
            <Avatar>
              {ownerAvatar ? (
                <AvatarImage src={ownerAvatar} alt={`${owner} avatar`} />
              ) : null}
              <AvatarFallback>{owner.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{owner}</span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}