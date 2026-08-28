import { BellRing } from "lucide-react";
import { waNotify } from "@/lib/site";

/**
 * Stand-in for a launch waiting list: opens WhatsApp with a pre-filled
 * "notify me" message, so unlaunched products still have a real action.
 */
export function NotifyMe({
  productName,
  className = "",
}: {
  productName: string;
  className?: string;
}) {
  return (
    <a
      href={waNotify(productName)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-[color:var(--botanical)] hover:text-[color:var(--botanical)] ${className}`}
    >
      <BellRing className="h-4 w-4" />
      Notify Me
    </a>
  );
}
