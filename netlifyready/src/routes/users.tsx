import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/PageHeader";
import { CrudDialog } from "@/components/CrudDialog";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useStore, addItem, updateItem, removeItem, newId, type UserRow } from "@/lib/store";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users & Roles — RankPilot" }, { name: "description", content: "Manage team members and roles." }] }),
  component: UsersPage,
});

const fields = [
  { name: "name", label: "Name", type: "text" as const },
  { name: "email", label: "Email", type: "email" as const },
  { name: "role", label: "Role", type: "select" as const, options: [
    { label: "Admin", value: "Admin" }, { label: "Editor", value: "Editor" }, { label: "Viewer", value: "Viewer" } ]},
  { name: "status", label: "Status", type: "select" as const, options: [
    { label: "Active", value: "Active" }, { label: "Invited", value: "Invited" } ]},
];

function UsersPage() {
  const rows = useStore((s) => s.users);
  return (
    <div>
      <PageHeader
        title="Users & Roles" subtitle="Invite teammates and control their access."
        actions={
          <CrudDialog<UserRow>
            title="Invite User" fields={fields}
            initial={{ id: "", name: "", email: "", role: "Viewer", status: "Invited" }}
            onSubmit={(v) => { addItem("users", { ...v, id: newId() }); toast.success("User invited"); }}
            trigger={<Button><Plus className="h-4 w-4 mr-1" /> Invite User</Button>}
          />
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard tone="blue" icon={<Users className="h-5 w-5" />} label="Total" value={rows.length} />
        <StatCard tone="green" icon={<Users className="h-5 w-5" />} label="Active" value={rows.filter((r) => r.status === "Active").length} />
        <StatCard tone="amber" icon={<Users className="h-5 w-5" />} label="Invited" value={rows.filter((r) => r.status === "Invited").length} />
        <StatCard tone="purple" icon={<Users className="h-5 w-5" />} label="Admins" value={rows.filter((r) => r.role === "Admin").length} />
      </div>
      <div className="mt-6">
        <DataTable<UserRow>
          rows={rows}
          columns={[
            { key: "n", header: "User", render: (r) => (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{r.name.slice(0,1)}</div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </div>
              </div>
            )},
            { key: "r", header: "Role", render: (r) => (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.role === "Admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{r.role}</span>
            )},
            { key: "s", header: "Status", render: (r) => (
              <span className={`rounded-full px-2 py-0.5 text-xs ${r.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
            )},
          ]}
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <CrudDialog<UserRow>
                title="Edit User" fields={fields} initial={r}
                onSubmit={(v) => { updateItem("users", r.id, v); toast.success("Updated"); }}
                trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button size="icon" variant="ghost" onClick={() => { removeItem("users", r.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );
}