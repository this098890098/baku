import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { Target, Search, ShieldCheck, Link2, TrendingUp } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Bar, BarChart, Legend,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RankPilot" },
      { name: "description", content: "Overview of SEO performance across all projects." },
    ],
  }),
  component: Index,
});

function Index() {
  const projects = useStore((s) => s.projects);
  const keywords = useStore((s) => s.keywords);
  const audits = useStore((s) => s.audits);
  const backlinks = useStore((s) => s.backlinks);
  const owner = useStore((s) => s.settings.ownerName);

  const trafficData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    traffic: 8000 + Math.round(Math.sin(i / 3) * 4000 + Math.random() * 5000),
  }));
  const positionData = ["Top 3", "4-10", "11-20", "21-50", "50+"].map((band, i) => ({
    band,
    count: [4, 6, 8, 12, 5][i],
  }));

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${owner}`}
        subtitle="Here's an overview of your SEO performance across all projects."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<Target className="h-5 w-5" />} label="Projects" value={projects.length} />
        <StatCard tone="purple" icon={<Search className="h-5 w-5" />} label="Keywords" value={keywords.length} />
        <StatCard tone="green" icon={<ShieldCheck className="h-5 w-5" />} label="Site Audits" value={audits.length} />
        <StatCard tone="amber" icon={<Link2 className="h-5 w-5" />} label="Backlinks" value={backlinks.length} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Organic Traffic</h2>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" /> +12.4%
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="traffic" stroke="var(--primary)" strokeWidth={2.5} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Keyword Positions</h2>
          <p className="text-sm text-muted-foreground">Distribution by SERP band</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="band" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <ul className="mt-3 divide-y divide-border">
            {projects.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  {p.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{p.domain}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Top Keywords</h2>
          <ul className="mt-3 divide-y divide-border">
            {keywords.slice(0, 6).map((k) => (
              <li key={k.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{k.keyword}</div>
                  <div className="truncate text-xs text-muted-foreground">{k.url}</div>
                </div>
                <div className="ml-3 text-right">
                  <div className="text-sm font-semibold">#{k.position}</div>
                  <div className="text-xs text-muted-foreground">vol {k.volume}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
