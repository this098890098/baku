import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, updateSettings, resetAll } from "@/lib/store";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "System Settings — RankPilot" }, { name: "description", content: "Workspace settings and preferences." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const [form, setForm] = useState(settings);
  useEffect(() => setForm(settings), [settings]);
  return (
    <div>
      <PageHeader title="System Settings" subtitle="Customize your workspace, branding and defaults." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Workspace</h2>
          <p className="text-sm text-muted-foreground">Brand and ownership.</p>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1.5"><Label>Brand name</Label>
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
            <div className="grid gap-1.5"><Label>Owner name</Label>
              <Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></div>
            <div className="grid gap-1.5"><Label>Owner email</Label>
              <Input type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Locale</h2>
          <p className="text-sm text-muted-foreground">Defaults for reporting.</p>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1.5"><Label>Timezone</Label>
              <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} /></div>
            <div className="grid gap-1.5"><Label>Currency</Label>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => { updateSettings(form); toast.success("Settings saved"); }}>Save changes</Button>
        <Button variant="outline" onClick={() => setForm(settings)}>Reset form</Button>
        <Button variant="ghost" className="text-destructive hover:text-destructive"
          onClick={() => { if (confirm("Wipe all local data and reseed demo content?")) { resetAll(); toast.success("Workspace reset"); } }}>
          Wipe & reseed demo data
        </Button>
      </div>
    </div>
  );
}