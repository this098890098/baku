import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  rows, columns, actions,
}: {
  rows: T[];
  columns: Column<T>[];
  actions?: (row: T) => ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`whitespace-nowrap px-4 py-3 text-left font-medium ${c.className ?? ""}`}>{c.header}</th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">No data yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>{c.render(r)}</td>
                ))}
                {actions && <td className="px-4 py-3 text-right">{actions(r)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}