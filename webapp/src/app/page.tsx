import Link from "next/link";
import { getStore } from "@/lib/store";
import { riskScore, zoneOf } from "@/lib/risk-calc";
import { ZONES } from "@/lib/reference";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const store = await getStore();
  const risks = await store.listRisks();

  const grid: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0));
  for (const r of risks) {
    grid[r.inherentImpact - 1][r.inherentProbability - 1] += 1;
  }

  const zoneCounts = ZONES.map((zone) => ({
    zone,
    count: risks.filter((r) => {
      const s = riskScore(r.inherentProbability, r.inherentImpact);
      return s >= zone.from && s <= zone.to;
    }).length,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Матрица рисков (тепловая карта)</h1>
        <p className="text-sm text-slate-500">
          Присущий (inherent) риск: количество рисков по сочетанию Вероятность × Влияние
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            <tr>
              <td />
              <td />
              <td colSpan={5} className="pb-1 text-center text-sm font-semibold text-slate-600">
                Вероятность
              </td>
            </tr>
            <tr>
              <td />
              <td />
              {[1, 2, 3, 4, 5].map((p) => (
                <td key={p} className="w-16 border border-slate-300 bg-slate-700 text-center text-sm font-semibold text-white py-2">
                  {p}
                </td>
              ))}
            </tr>
            {[5, 4, 3, 2, 1].map((impact, rowIdx) => (
              <tr key={impact}>
                {rowIdx === 0 && (
                  <td
                    rowSpan={5}
                    className="w-8 rotate-180 text-center text-sm font-semibold text-slate-600"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    Влияние
                  </td>
                )}
                <td className="w-16 border border-slate-300 bg-slate-700 text-center text-sm font-semibold text-white py-2">
                  {impact}
                </td>
                {[1, 2, 3, 4, 5].map((prob) => {
                  const score = riskScore(prob, impact);
                  const zone = zoneOf(score);
                  const count = grid[impact - 1][prob - 1];
                  return (
                    <td key={prob} className="border border-slate-300 p-0">
                      <Link
                        href={`/risks?prob=${prob}&impact=${impact}`}
                        className="flex h-16 w-16 flex-col items-center justify-center text-lg font-bold transition hover:opacity-80"
                        style={{ backgroundColor: zone.color, color: zone.textColor }}
                        title={`${zone.name} (${score} баллов)`}
                      >
                        {count}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Легенда</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {ZONES.map((z) => (
            <div key={z.name} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="h-4 w-4 shrink-0 rounded" style={{ backgroundColor: z.color }} />
              <span className="w-16 shrink-0 font-mono text-xs text-slate-500">{z.from}-{z.to}</span>
              <span className="w-32 shrink-0 font-semibold">{z.name}</span>
              <span className="text-slate-500">{z.response}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Итого рисков по зонам (присущий риск)</h2>
        <table className="w-full max-w-xl border-collapse overflow-hidden rounded-md border border-slate-200 text-sm">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="px-3 py-2 text-left">Зона</th>
              <th className="px-3 py-2 text-left">Диапазон баллов</th>
              <th className="px-3 py-2 text-right">Количество рисков</th>
            </tr>
          </thead>
          <tbody>
            {zoneCounts.map(({ zone, count }) => (
              <tr key={zone.name} className="border-t border-slate-200 bg-white">
                <td className="px-3 py-2 font-medium">{zone.name}</td>
                <td className="px-3 py-2 text-slate-500">{zone.from}-{zone.to}</td>
                <td className="px-3 py-2 text-right font-semibold">{count}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-300 bg-slate-50 font-bold">
              <td className="px-3 py-2" colSpan={2}>Всего рисков в реестре</td>
              <td className="px-3 py-2 text-right">{risks.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
