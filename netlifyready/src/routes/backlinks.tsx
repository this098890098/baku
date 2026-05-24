import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useStore, addItem, updateItem, removeItem, newId, type Backlink } from "@/lib/store";
import { Plus, Pencil, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/backlinks")({
  head: () => ({ meta: [{ title: "Backlinks — RankPilot" }, { name: "description", content: "Monitor backlinks and add new link prospects." }] }),
  component: BacklinksPage,
});

const fields = [
  { name: "source", label: "Source URL", type: "url" as const },
  { name: "target", label: "Target URL", type: "url" as const },
  { name: "anchor", label: "Anchor text", type: "text" as const },
  { name: "authority", label: "Authority (0-100)", type: "number" as const },
  { name: "type", label: "Type", type: "select" as const, options: [
    { label: "dofollow", value: "dofollow" }, { label: "nofollow", value: "nofollow" },
  ]},
];

function BacklinksPage() {
  const rows = useStore((s) => s.backlinks);
  return (
    <div>
      <PageHeader
        title="Backlinks" subtitle="Discover, track and add backlinks pointing to your sites."
        actions={
          <CrudDialog<Backlink>
            title="Add Backlink" fields={fields}
            initial={{ id: "", source: "", target: "", anchor: "", authority: 50, type: "dofollow" }}
            onSubmit={(v) => { addItem("backlinks", { ...v, id: newId() }); toast.success("Backlink added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Add Backlink</Button>}
          />
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<Link2 className="h-5 w-5" />} label="Total" value={rows.length} />
        <StatCard tone="green" icon={<Link2 className="h-5 w-5" />} label="Dofollow" value={rows.filter((r) => r.type === "dofollow").length} />
        <StatCard tone="amber" icon={<Link2 className="h-5 w-5" />} label="Nofollow" value={rows.filter((r) => r.type === "nofollow").length} />
        <StatCard tone="purple" icon={<Link2 className="h-5 w-5" />} label="Avg Authority" value={rows.length ? Math.round(rows.reduce((a, b) => a + b.authority, 0) / rows.length) : 0} />
      </div>
      <div className="mt-6">
        <DataTable<Backlink>
          rows={rows}
          columns={[
            { key: "src", header: "Source", render: (r) => <span className="font-medium">{r.source}</span> },
            { key: "tgt", header: "Target", render: (r) => <span className="text-muted-foreground">{r.target}</span> },
            { key: "an", header: "Anchor", render: (r) => r.anchor },
            { key: "au", header: "Authority", render: (r) => <span className="font-semibold">{r.authority}</span> },
            { key: "t", header: "Type", render: (r) => (
              <span className={`rounded-full px-2 py-0.5 text-xs ${r.type === "dofollow" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{r.type}</span>
            ) },
          ]}
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <CrudDialog<Backlink>
                title="Edit Backlink" fields={fields} initial={r}
                onSubmit={(v) => { updateItem("backlinks", r.id, v); toast.success("Updated"); }}
                trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button size="icon" variant="ghost" onClick={() => { removeItem("backlinks", r.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}