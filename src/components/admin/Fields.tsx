import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

/**
 * Presentation only — no react-hook-form generics anywhere in this file.
 *
 * Each editor wires its own `useFieldArray` and passes the handlers down, which
 * keeps the field names literal (and therefore type-checked against the form) and
 * keeps this file from growing a generic signature per list shape.
 */

export function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs text-[color:var(--burgundy)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Rows({
  title,
  hint,
  count,
  onAdd,
  addLabel = "Add row",
  children,
}: {
  title: string;
  hint?: string;
  count: number;
  onAdd: () => void;
  addLabel?: string;
  children: ReactNode;
}) {
  return (
    <Panel title={title} {...(hint ? { hint } : {})}>
      {count === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing here yet — this section stays hidden on the site.
        </p>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors sm:hover:border-[color:var(--gold)] sm:hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </Panel>
  );
}

export function Row({
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-[color:var(--surface)] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow text-muted-foreground">{index + 1}</span>
        <div className="flex gap-1">
          <IconButton
            label="Move up"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
          >
            <ChevronUp className="h-4 w-4" />
          </IconButton>
          <IconButton
            label="Move down"
            disabled={index === count - 1}
            onClick={() => onMove(index, index + 1)}
          >
            <ChevronDown className="h-4 w-4" />
          </IconButton>
          <IconButton label="Remove" onClick={() => onRemove(index)}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

/**
 * A native `<select>`, not the Radix one in `components/ui`: it accepts a
 * `register()` spread directly, needs no `Controller`, and on a phone it opens the
 * platform picker, which is the better control here.
 */
export function IconSelect({
  names,
  ...props
}: { names: readonly string[] } & ComponentProps<"select">) {
  return (
    <select
      {...props}
      className="flex min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
    >
      {names.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}

function IconButton({
  label,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors disabled:opacity-30 sm:hover:bg-card sm:hover:text-primary"
    >
      {children}
    </button>
  );
}
