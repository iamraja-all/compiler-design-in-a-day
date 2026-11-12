import React from 'react';

interface DataTableProps {
  children: React.ReactNode;
}

export function DataTable({ children }: DataTableProps) {
  return (
    <div className="my-6 rounded-[var(--r-md)] border border-[var(--border)] overflow-hidden bg-[var(--surface)] shadow-xs not-prose">
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-left text-sm border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)] sticky top-0 font-semibold">
      {children}
    </thead>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-[var(--border)]/60 even:bg-[var(--surface-2)]/30 hover:bg-[var(--surface-2)]/60 transition-colors">
      {children}
    </tr>
  );
}

export function TableCell({ children, isHeader = false }: { children: React.ReactNode; isHeader?: boolean }) {
  if (isHeader) {
    return (
      <th className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-[var(--text)] whitespace-nowrap">
        {children}
      </th>
    );
  }
  return (
    <td className="px-4 py-3 text-[var(--text)] text-sm align-top font-mono">
      {children}
    </td>
  );
}
