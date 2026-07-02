import Link from "next/link";
import { getStore } from "@/lib/store";
import { isOverdue } from "@/lib/risk-calc";

export const dynamic = "force-dynamic";

function progressColor(pct: number): string {
  if (pct >= 100) return "bg-[#00B050]";
  if (pct >= 50) return "bg-[#FFFF00]";
  return "bg-[#FFC000]";
}

export default async function PlanPage() {
  const store = await getStore();
  const actions = await store.listActions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">План обработки рисков</h1>
        <Link
          href="/plan/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          + Добавить мероприятие
        </Link>
      </div>

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Риск</th>
              <th className="px-3 py-2">Мероприятие</th>
              <th className="px-3 py-2">Ответственный</th>
              <th className="px-3 py-2">Завершение</th>
              <th className="px-3 py-2">Статус</th>
              <th className="px-3 py-2">% выполнения</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((a) => {
              const overdue = isOverdue(a.endDate, a.status);
              return (
                <tr key={a.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono text-xs">
                    <Link href={`/plan/${a.id}`} className="font-semibold text-blue-600 hover:underline">
                      {a.id}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/risks/${a.riskId}`} className="text-slate-600 hover:underline">
                      {a.riskId}
                    </Link>
                  </td>
                  <td className="px-3 py-2 max-w-xs truncate" title={a.action}>{a.action}</td>
                  <td className="px-3 py-2">{a.owner}</td>
                  <td className={`px-3 py-2 ${overdue ? "font-semibold text-red-600" : ""}`}>
                    {a.endDate}
                    {overdue && " ⚠"}
                  </td>
                  <td className="px-3 py-2">{a.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full ${progressColor(a.progressPct)}`} style={{ width: `${Math.min(a.progressPct, 100)}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{a.progressPct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {actions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                  Мероприятий пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {actions.length > 0 && (
        <p className="text-xs text-slate-400">
          ⚠ — мероприятие просрочено (дата завершения в прошлом, статус не «Завершено»)
        </p>
      )}
    </div>
  );
}
