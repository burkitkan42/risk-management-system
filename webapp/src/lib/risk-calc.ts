import { ZONES, type ZoneDef } from "./reference";

export function riskScore(probability: number, impact: number): number {
  return probability * impact;
}

export function zoneOf(score: number): ZoneDef {
  const zone = ZONES.find((z) => score >= z.from && score <= z.to);
  return zone ?? ZONES[0];
}

export function isOverdue(endDate: string, status: string): boolean {
  if (!endDate || status === "Завершено" || status === "Отменено") return false;
  return new Date(endDate) < new Date(new Date().toDateString());
}
