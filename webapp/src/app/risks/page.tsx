import Link from "next/link";
import { getStore } from "@/lib/store";
import { riskScore } from "@/lib/risk-calc";
import ZoneBadge from "@/components/ZoneBadge";

export const dynamic = "force-dynamic";

export default async function RisksPage({
  searchParams,
}: {
  searchParams: Promise<{ prob?: string; impact?: string }>;
}) {
  const { prob, impact } = await searchParams;
  const store = await getStore();
  let risks = await store.listRisks();

  if (prob) risks = risks.filter((r) => r.inherentProbability === Number(prob));
  if (impact) risks = risks.filter((r) => r.inherentImpact === Number(impact));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Реестр рисков</h1>
          {(prob || impact) && (
            <p className="text-sm text-slate-500">
              Фильтр: вероятность {prob ?? "любая"}, влияние {impact ?? "любое"} ·{" "}
              <Link href="/risks" className="text-blue-600 hover:underline">
                сбросить
              </Link>
            </p>
          )}
        </div>
        <Link
          href="/risks/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          + Добавить риск
        </Link>
      </div>

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Категория</th>
              <th className="px-3 py-2">Наименование</th>
              <th className="px-3 py-2">Владелец</th>
              <th className="px-3 py-2">Присущий риск</th>
              <th className="px-3 py-2">Остаточный риск</th>
              <th className="px-3 py-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-3 py-2 font-mono text-xs text-slate-500">
                  <Link href={`/risks/${r.id}`} className="font-semibold text-blue-600 hover:underline">
                    {r.id}
                  </Link>
                </td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2 max-w-xs truncate" title={r.name}>{r.name}</td>
                <td className="px-3 py-2">{r.owner}</td>
                <td className="px-3 py-2">
                  <ZoneBadge score={riskScore(r.inherentProbability, r.inherentImpact)} />
                </td>
                <td className="px-3 py-2">
                  <ZoneBadge score={riskScore(r.residualProbability, r.residualImpact)} />
                </td>
                <td className="px-3 py-2">{r.status}</td>
              </tr>
            ))}
            {risks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                  Риски не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
