import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useStore, addItem, updateItem, removeItem, newId, type Task } from "@/lib/store";
import { Plus, Pencil, Trash2, CheckSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — RankPilot" }, { name: "description", content: "Manage SEO tasks across your team." }] }),
  component: TasksPage,
});

const fields = [
  { name: "title", label: "Title", type: "text" as const },
  { name: "assignee", label: "Assignee", type: "text" as const },
  { name: "due", label: "Due date", type: "text" as const },
  { name: "priority", label: "Priority", type: "select" as const, options: [
    { label: "Low", value: "Low" }, { label: "Medium", value: "Medium" }, { label: "High", value: "High" } ]},
  { name: "status", label: "Status", type: "select" as const, options: [
    { label: "Todo", value: "Todo" }, { label: "In Progress", value: "In Progress" }, { label: "Done", value: "Done" } ]},
];

function TasksPage() {
  const rows = useStore((s) => s.tasks);
  return (
    <div>
      <PageHeader
        title="Tasks" subtitle="Plan, assign and track SEO work for your team."
        actions={
          <CrudDialog<Task>
            title="Add Task" fields={fields}
            initial={{ id: "", title: "", assignee: "", due: new Date().toISOString().slice(0, 10), priority: "Medium", status: "Todo" }}
            onSubmit={(v) => { addItem("tasks", { ...v, id: newId() }); toast.success("Task added"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Add Task</Button>}
          />
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<CheckSquare className="h-5 w-5" />} label="Total" value={rows.length} />
        <StatCard tone="amber" icon={<CheckSquare className="h-5 w-5" />} label="Todo" value={rows.filter((r) => r.status === "Todo").length} />
        <StatCard tone="purple" icon={<CheckSquare className="h-5 w-5" />} label="In Progress" value={rows.filter((r) => r.status === "In Progress").length} />
        <StatCard tone="green" icon={<CheckSquare className="h-5 w-5" />} label="Done" value={rows.filter((r) => r.status === "Done").length} />
      </div>
      <div className="mt-6">
        <DataTable<Task>
          rows={rows}
          columns={[
            { key: "t", header: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
            { key: "a", header: "Assignee", render: (r) => r.assignee },
            { key: "d", header: "Due", render: (r) => r.due },
            { key: "p", header: "Priority", render: (r) => (
              <span className={`rounded-full px-2 py-0.5 text-xs ${r.priority === "High" ? "bg-red-100 text-red-700" : r.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>{r.priority}</span>
            )},
            { key: "s", header: "Status", render: (r) => (
              <span className={`rounded-full px-2 py-0.5 text-xs ${r.status === "Done" ? "bg-emerald-100 text-emerald-700" : r.status === "In Progress" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
            )},
          ]}
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <CrudDialog<Task>
                title="Edit Task" fields={fields} initial={r}
                onSubmit={(v) => { updateItem("tasks", r.id, v); toast.success("Updated"); }}
                trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button size="icon" variant="ghost" onClick={() => { removeItem("tasks", r.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}