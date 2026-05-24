import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useStore, addItem, updateItem, removeItem, newId, type Audit } from "@/lib/store";
import { Plus, Pencil, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/audits")({
  head: () => ({ meta: [{ title: "Site Audits — RankPilot" }, { name: "description", content: "Run and review site health audits." }] }),
  component: AuditsPage,
});

function AuditsPage() {
  const audits = useStore((s) => s.audits);
  const projects = useStore((s) => s.projects);
  const projName = (id: string) => projects.find((p) => p.id === id)?.name ?? "—";
  const fields = [
    { name: "projectId", label: "Project", type: "select" as const, options: projects.map((p) => ({ label: p.name, value: p.id })) },
    { name: "url", label: "URL", type: "url" as const },
    { name: "score", label: "Score (0-100)", type: "number" as const },
    { name: "issues", label: "Issues", type: "number" as const },
    { name: "date", label: "Date", type: "text" as const },
  ];
  const avg = audits.length ? Math.round(audits.reduce((a, b) => a + b.score, 0) / audits.length) : 0;
  return (
    <div>
      <PageHeader
        title="Site Audits" subtitle="Technical SEO health checks for every project."
        actions={
          <CrudDialog<Audit>
            title="New Audit" fields={fields}
            initial={{ id: "", projectId: projects[0]?.id ?? "", url: "https://", score: 80, issues: 5, date: new Date().toISOString().slice(0, 10) }}
            onSubmit={(v) => { addItem("audits", { ...v, id: newId() }); toast.success("Audit added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Run Audit</Button>}
          />
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<ShieldCheck className="h-5 w-5" />} label="Audits" value={audits.length} />
        <StatCard tone="green" icon={<ShieldCheck className="h-5 w-5" />} label="Avg Score" value={avg} />
        <StatCard tone="amber" icon={<AlertTriangle className="h-5 w-5" />} label="Issues" value={audits.reduce((a, b) => a + b.issues, 0)} />
        <StatCard tone="purple" icon={<ShieldCheck className="h-5 w-5" />} label="Sites" value={new Set(audits.map((a) => a.projectId)).size} />
      </div>
      <div className="mt-6">
        <DataTable<Audit>
          rows={audits}
          columns={[
            { key: "p", header: "Project", render: (r) => projName(r.projectId) },
            { key: "u", header: "URL", render: (r) => <span className="text-muted-foreground">{r.url}</span> },
            { key: "s", header: "Score", render: (r) => (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.score >= 80 ? "bg-emerald-100 text-emerald-700" : r.score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{r.score}</span>
            ) },
            { key: "i", header: "Issues", render: (r) => r.issues },
            { key: "d", header: "Date", render: (r) => r.date },
          ]}
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <CrudDialog<Audit>
                title="Edit Audit" fields={fields} initial={r}
                onSubmit={(v) => { updateItem("audits", r.id, v); toast.success("Audit updated"); }}
                trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button size="icon" variant="ghost" onClick={() => { removeItem("audits", r.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}