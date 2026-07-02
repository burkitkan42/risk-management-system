import { zoneOf } from "@/lib/risk-calc";

export default function ZoneBadge({ score }: { score: number }) {
  const zone = zoneOf(score);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: zone.color, color: zone.textColor }}
    >
      {score} · {zone.name}
    </span>
  );
}
