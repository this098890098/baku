import { ReactNode, useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Field =
  | { name: string; label: string; type: "text" | "number" | "url" | "email" }
  | { name: string; label: string; type: "textarea" }
  | { name: string; label: string; type: "select"; options: { label: string; value: string }[] };

export function CrudDialog<T extends Record<string, any>>({
  trigger, title, fields, initial, onSubmit, submitLabel = "Save",
}: {
  trigger: ReactNode;
  title: string;
  fields: Field[];
  initial: T;
  onSubmit: (values: T) => void;
  submitLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<T>(initial);
  useEffect(() => { if (open) setValues(initial); }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-2">
          {fields.map((f) => (
            <div key={f.name} className="grid gap-1.5">
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.name}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                />
              ) : f.type === "select" ? (
                <Select
                  value={String(values[f.name] ?? "")}
                  onValueChange={(v) => setValues({ ...values, [f.name]: v })}
                >
                  <SelectTrigger><SelectValue placeholder={`Select ${f.label}`} /></SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={f.name}
                  type={f.type}
                  value={values[f.name] ?? ""}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { onSubmit(values); setOpen(false); }}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}