import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, addItem, updateItem, removeItem, newId, type Keyword } from "@/lib/store";
import { Plus, Pencil, Trash2, Search, Hash, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/keywords")({
  head: () => ({ meta: [{ title: "Keywords — RankPilot" }, { name: "description", content: "Track and add SEO keywords across all your projects." }] }),
  component: KeywordsPage,
});

function KeywordsPage() {
  const keywords = useStore((s) => s.keywords);
  const projects = useStore((s) => s.projects);
  const [q, setQ] = useState("");

  const projOptions = projects.map((p) => ({ label: p.name, value: p.id }));
  const projName = (id: string) => projects.find((p) => p.id === id)?.name ?? "—";

  const fields = [
    { name: "keyword", label: "Keyword", type: "text" as const },
    { name: "url", label: "Target URL", type: "url" as const },
    { name: "projectId", label: "Project", type: "select" as const, options: projOptions },
    { name: "position", label: "Position", type: "number" as const },
    { name: "volume", label: "Search Volume", type: "number" as const },
    { name: "difficulty", label: "Difficulty (0-100)", type: "number" as const },
  ];

  const filtered = keywords.filter((k) => k.keyword.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Keywords"
        subtitle="Track ranking keywords and add new ones for any project."
        actions={
          <CrudDialog<Keyword>
            title="Add Keyword"
            fields={fields}
            initial={{ id: "", keyword: "", url: "https://", projectId: projects[0]?.id ?? "", position: 0, volume: 0, difficulty: 0 }}
            onSubmit={(v) => { addItem("keywords", { ...v, id: newId() }); toast.success("Keyword added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Add Keyword</Button>}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<Hash className="h-5 w-5" />} label="Tracked" value={keywords.length} />
        <StatCard tone="green" icon={<TrendingUp className="h-5 w-5" />} label="Top 10" value={keywords.filter((k) => k.position <= 10).length} />
        <StatCard tone="amber" icon={<TrendingUp className="h-5 w-5" />} label="11-50" value={keywords.filter((k) => k.position > 10 && k.position <= 50).length} />
        <StatCard tone="purple" icon={<Hash className="h-5 w-5" />} label="Avg Difficulty" value={keywords.length ? Math.round(keywords.reduce((a, b) => a + b.difficulty, 0) / keywords.length) : 0} />
      </div>

      <div className="my-4 relative max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search keywords..." className="pl-9 rounded-full bg-card" />
      </div>

      <DataTable<Keyword>
        rows={filtered}
        columns={[
          { key: "kw", header: "Keyword", render: (r) => (
            <div>
              <div className="font-semibold">{r.keyword}</div>
              <div className="text-xs text-muted-foreground truncate max-w-[260px]">{r.url}</div>
            </div>
          ) },
          { key: "project", header: "Project", render: (r) => <span className="text-foreground/80">{projName(r.projectId)}</span> },
          { key: "pos", header: "Position", render: (r) => <span className="font-semibold">#{r.position}</span> },
          { key: "vol", header: "Volume", render: (r) => r.volume.toLocaleString() },
          { key: "diff", header: "Difficulty", render: (r) => (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${r.difficulty}%` }} />
              </div>
              <span className="text-xs">{r.difficulty}</span>
            </div>
          ) },
        ]}
        actions={(r) => (
          <div className="flex justify-end gap-1">
            <CrudDialog<Keyword>
              title="Edit Keyword" fields={fields} initial={r}
              onSubmit={(v) => { updateItem("keywords", r.id, v); toast.success("Keyword updated"); }}
              trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
            />
            <Button size="icon" variant="ghost" onClick={() => { removeItem("keywords", r.id); toast.success("Keyword removed"); }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}