import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useStore, addItem, updateItem, removeItem, newId, type ReportItem } from "@/lib/store";
import { Plus, Pencil, Trash2, FileBarChart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — RankPilot" }, { name: "description", content: "Saved SEO and ads reports." }] }),
  component: ReportsPage,
});

const fields = [
  { name: "title", label: "Title", type: "text" as const },
  { name: "type", label: "Type", type: "select" as const, options: [
    { label: "SEO", value: "SEO" }, { label: "Ads", value: "Ads" }, { label: "Backlinks", value: "Backlinks" }, { label: "Traffic", value: "Traffic" } ]},
  { name: "date", label: "Date", type: "text" as const },
  { name: "author", label: "Author", type: "text" as const },
];

function ReportsPage() {
  const rows = useStore((s) => s.reports);
  return (
    <div>
      <PageHeader
        title="Reports" subtitle="Generate and share SEO performance reports."
        actions={
          <CrudDialog<ReportItem>
            title="New Report" fields={fields}
            initial={{ id: "", title: "", type: "SEO", date: new Date().toISOString().slice(0, 10), author: "Admin" }}
            onSubmit={(v) => { addItem("reports", { ...v, id: newId() }); toast.success("Report added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> New Report</Button>}
          />
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<FileBarChart className="h-5 w-5" />} label="Total" value={rows.length} />
        <StatCard tone="purple" icon={<FileBarChart className="h-5 w-5" />} label="SEO" value={rows.filter((r) => r.type === "SEO").length} />
        <StatCard tone="amber" icon={<FileBarChart className="h-5 w-5" />} label="Ads" value={rows.filter((r) => r.type === "Ads").length} />
        <StatCard tone="green" icon={<FileBarChart className="h-5 w-5" />} label="Other" value={rows.filter((r) => r.type !== "SEO" && r.type !== "Ads").length} />
      </div>
      <div className="mt-6">
        <DataTable<ReportItem>
          rows={rows}
          columns={[
            { key: "t", header: "Title", render: (r) => <span className="font-semibold">{r.title}</span> },
            { key: "ty", header: "Type", render: (r) => <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{r.type}</span> },
            { key: "d", header: "Date", render: (r) => r.date },
            { key: "a", header: "Author", render: (r) => r.author },
          ]}
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <CrudDialog<ReportItem>
                title="Edit Report" fields={fields} initial={r}
                onSubmit={(v) => { updateItem("reports", r.id, v); toast.success("Updated"); }}
                trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button size="icon" variant="ghost" onClick={() => { removeItem("reports", r.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}