import {
  Activity,
  Ambulance,
  Award,
  BadgeCheck,
  Bandage,
  BedDouble,
  Bug,
  CircleCheck,
  Droplets,
  FileCheck2,
  FileText,
  FlaskConical,
  Flame,
  Heart,
  Leaf,
  Microscope,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  TestTube,
  Thermometer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Icons the admin panel can attach to a condition or a certification.
 *
 * The database stores the *name*; this map turns it back into a component. An
 * explicit map rather than a dynamic lookup into lucide keeps the bundle fixed
 * and predictable — importing the whole icon set to satisfy an arbitrary string
 * would add megabytes for the sake of a dozen entries.
 */
export const ICONS: Record<string, LucideIcon> = {
  Activity,
  Ambulance,
  Award,
  BadgeCheck,
  Bandage,
  BedDouble,
  Bug,
  CircleCheck,
  Droplets,
  FileCheck2,
  FileText,
  FlaskConical,
  Flame,
  Heart,
  Leaf,
  Microscope,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  TestTube,
  Thermometer,
};

/** Offered by the editor's icon picker, in the order shown. */
export const ICON_NAMES = Object.keys(ICONS).sort();

export const FALLBACK_ICON_NAME = "Leaf";

/**
 * Never throws and never returns undefined: an icon the editor no longer offers,
 * or a name typed by hand in the Firebase console, degrades to the fallback
 * instead of blanking the row it belongs to.
 */
export function resolveIcon(name: string | null | undefined): LucideIcon {
  return (name ? ICONS[name] : undefined) ?? Leaf;
}
