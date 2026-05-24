import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useStore, addItem, updateItem, removeItem, newId, type Campaign } from "@/lib/store";
import { Plus, Pencil, Trash2, DollarSign, MousePointerClick, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/campaigns")({
  head: () => ({ meta: [{ title: "Ads Campaigns — RankPilot" }, { name: "description", content: "Manage Google, Meta, LinkedIn and TikTok ad campaigns." }] }),
  component: CampaignsPage,
});

const fields = [
  { name: "name", label: "Campaign name", type: "text" as const },
  { name: "project", label: "Project", type: "text" as const },
  { name: "platform", label: "Platform", type: "select" as const, options: [
    { label: "Google Ads", value: "Google Ads" }, { label: "Meta", value: "Meta" },
    { label: "LinkedIn", value: "LinkedIn" }, { label: "TikTok", value: "TikTok" }] },
  { name: "budget", label: "Budget", type: "number" as const },
  { name: "spent", label: "Spent", type: "number" as const },
  { name: "impressions", label: "Impressions", type: "number" as const },
  { name: "clicks", label: "Clicks", type: "number" as const },
  { name: "conversions", label: "Conversions", type: "number" as const },
  { name: "status", label: "Status", type: "select" as const, options: [
    { label: "Active", value: "Active" }, { label: "Paused", value: "Paused" }] },
];

function CampaignsPage() {
  const rows = useStore((s) => s.campaigns);
  const spend = rows.reduce((a, b) => a + b.spent, 0);
  const clicks = rows.reduce((a, b) => a + b.clicks, 0);
  const conv = rows.reduce((a, b) => a + b.conversions, 0);
  return (
    <div>
      <PageHeader
        title="Ads Campaigns" subtitle="Manage Google, Meta, LinkedIn and TikTok campaigns from one place."
        actions={
          <CrudDialog<Campaign>
            title="Add Campaign" fields={fields}
            initial={{ id: "", name: "", project: "", platform: "Google Ads", budget: 0, spent: 0, impressions: 0, clicks: 0, conversions: 0, status: "Active" }}
            onSubmit={(v) => { addItem("campaigns", { ...v, id: newId() }); toast.success("Campaign added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Add Campaign</Button>}
          />
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<DollarSign className="h-5 w-5" />} label="Total spend" value={`$${spend.toLocaleString()}`} />
        <StatCard tone="amber" icon={<DollarSign className="h-5 w-5" />} label="Budget" value={`$${rows.reduce((a, b) => a + b.budget, 0).toLocaleString()}`} />
        <StatCard tone="purple" icon={<MousePointerClick className="h-5 w-5" />} label="Clicks" value={clicks.toLocaleString()} />
        <StatCard tone="green" icon={<TrendingUp className="h-5 w-5" />} label="Conversions" value={conv.toLocaleString()} />
      </div>
      <div className="mt-6">
        <DataTable<Campaign>
          rows={rows}
          columns={[
            { key: "n", header: "Campaign", render: (r) => (
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.project}</div>
              </div>
            )},
            { key: "pl", header: "Platform", render: (r) => (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{r.platform}</span>
            )},
            { key: "b", header: "Budget / Spent", render: (r) => (
              <div className="min-w-[140px]">
                <div className="text-sm font-semibold">${r.spent.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">of ${r.budget.toLocaleString()}</div>
                <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (r.spent / Math.max(1, r.budget)) * 100)}%` }} />
                </div>
              </div>
            )},
            { key: "i", header: "Impr.", render: (r) => r.impressions.toLocaleString() },
            { key: "c", header: "Clicks", render: (r) => r.clicks.toLocaleString() },
            { key: "ctr", header: "CTR", render: (r) => `${((r.clicks / Math.max(1, r.impressions)) * 100).toFixed(2)}%` },
            { key: "cv", header: "Conv.", render: (r) => <span className="font-semibold text-emerald-600">{r.conversions.toLocaleString()}</span> },
            { key: "s", header: "Status", render: (r) => (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
            )},
          ]}
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <CrudDialog<Campaign>
                title="Edit Campaign" fields={fields} initial={r}
                onSubmit={(v) => { updateItem("campaigns", r.id, v); toast.success("Updated"); }}
                trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button size="icon" variant="ghost" onClick={() => { removeItem("campaigns", r.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}