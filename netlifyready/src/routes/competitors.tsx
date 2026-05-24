import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useStore, addItem, updateItem, removeItem, newId, type Competitor } from "@/lib/store";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/competitors")({
  head: () => ({ meta: [{ title: "Competitors — RankPilot" }, { name: "description", content: "Track competitor domains and keyword overlap." }] }),
  component: CompetitorsPage,
});

const fields = [
  { name: "name", label: "Name", type: "text" as const },
  { name: "domain", label: "Domain", type: "text" as const },
  { name: "overlap", label: "Keyword overlap %", type: "number" as const },
  { name: "keywords", label: "Shared keywords", type: "number" as const },
];

function CompetitorsPage() {
  const rows = useStore((s) => s.competitors);
  return (
    <div>
      <PageHeader
        title="Competitors" subtitle="See who you compete with and add new rivals to monitor."
        actions={
          <CrudDialog<Competitor>
            title="Add Competitor" fields={fields}
            initial={{ id: "", name: "", domain: "", overlap: 0, keywords: 0 }}
            onSubmit={(v) => { addItem("competitors", { ...v, id: newId() }); toast.success("Competitor added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Add Competitor</Button>}
          />
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard tone="blue" icon={<Sparkles className="h-5 w-5" />} label="Total" value={rows.length} />
        <StatCard tone="purple" icon={<Sparkles className="h-5 w-5" />} label="Avg Overlap" value={rows.length ? Math.round(rows.reduce((a, b) => a + b.overlap, 0) / rows.length) + "%" : "0%"} />
        <StatCard tone="green" icon={<Sparkles className="h-5 w-5" />} label="Shared KWs" value={rows.reduce((a, b) => a + b.keywords, 0)} />
      </div>
      <div className="mt-6">
        <DataTable<Competitor>
          rows={rows}
          columns={[
            { key: "n", header: "Name", render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: "d", header: "Domain", render: (r) => <span className="text-muted-foreground">{r.domain}</span> },
            { key: "o", header: "Overlap", render: (r) => `${r.overlap}%` },
            { key: "k", header: "Shared Keywords", render: (r) => r.keywords.toLocaleString() },
          ]}
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <CrudDialog<Competitor>
                title="Edit Competitor" fields={fields} initial={r}
                onSubmit={(v) => { updateItem("competitors", r.id, v); toast.success("Updated"); }}
                trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button size="icon" variant="ghost" onClick={() => { removeItem("competitors", r.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}