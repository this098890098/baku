import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, addItem, updateItem, removeItem, newId, type Project } from "@/lib/store";
import { Globe, Plus, MapPin, ExternalLink, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — RankPilot" }, { name: "description", content: "Manage all websites your team is tracking." }] }),
  component: ProjectsPage,
});

const fields = [
  { name: "name", label: "Project name", type: "text" as const },
  { name: "domain", label: "Domain", type: "text" as const },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "country", label: "Country code", type: "text" as const },
  { name: "initials", label: "Initials", type: "text" as const },
  { name: "status", label: "Status", type: "select" as const, options: [
    { label: "Active", value: "Active" }, { label: "Paused", value: "Paused" },
  ]},
];

function ProjectsPage() {
  const projects = useStore((s) => s.projects);
  const [q, setQ] = useState("");
  const filtered = projects.filter((p) => (p.name + p.domain).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Manage all websites your team is optimizing."
        actions={
          <CrudDialog<Project>
            title="Add Project"
            fields={fields}
            initial={{ id: "", name: "", domain: "", description: "", country: "US", status: "Active", initials: "NP" }}
            onSubmit={(v) => { addItem("projects", { ...v, id: newId() }); toast.success("Project added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Add Project</Button>}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<Globe className="h-5 w-5" />} label="Total" value={projects.length} />
        <StatCard tone="green" icon={<Globe className="h-5 w-5" />} label="Active" value={projects.filter((p) => p.status === "Active").length} />
        <StatCard tone="amber" icon={<Globe className="h-5 w-5" />} label="Paused" value={projects.filter((p) => p.status === "Paused").length} />
        <StatCard tone="purple" icon={<MapPin className="h-5 w-5" />} label="Countries" value={new Set(projects.map((p) => p.country)).size} />
      </div>

      <div className="mt-6 relative max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or domain..." className="pl-9 rounded-full bg-card" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-base font-bold text-primary-foreground">
                {p.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{p.name}</div>
                <a href={`https://${p.domain}`} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 truncate text-sm text-muted-foreground hover:text-primary">
                  {p.domain} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/80">
                <MapPin className="h-3 w-3" /> {p.country}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                ● {p.status}
              </span>
              <div className="ml-auto flex gap-1">
                <CrudDialog<Project>
                  title="Edit Project"
                  fields={fields}
                  initial={p}
                  onSubmit={(v) => { updateItem("projects", p.id, v); toast.success("Project updated"); }}
                  trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
                />
                <Button size="icon" variant="ghost" onClick={() => { removeItem("projects", p.id); toast.success("Project deleted"); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}