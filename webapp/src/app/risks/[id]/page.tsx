import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/store";
import { deleteRisk, updateRisk } from "@/lib/actions";
import RiskForm from "@/components/RiskForm";
import ZoneBadge from "@/components/ZoneBadge";
import { riskScore } from "@/lib/risk-calc";

export const dynamic = "force-dynamic";

export default async function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await getStore();
  const risk = await store.getRisk(id);
  if (!risk) notFound();

  const actions = await store.listActionsForRisk(id);
  const updateWithId = updateRisk.bind(null, id);
  const deleteWithId = deleteRisk.bind(null, id);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {risk.id} · {risk.name}
          </h1>
          <div className="mt-2 flex gap-2">
            <ZoneBadge score={riskScore(risk.inherentProbability, risk.inherentImpact)} />
            <span className="text-slate-400 text-sm">→</span>
            <ZoneBadge score={riskScore(risk.residualProbability, risk.residualImpact)} />
          </div>
        </div>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Удалить риск
          </button>
        </form>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Мероприятия по обработке ({actions.length})
        </h2>
        {actions.length === 0 ? (
          <p className="text-sm text-slate-400">Мероприятий пока нет.</p>
        ) : (
          <ul className="space-y-1">
            {actions.map((a) => (
              <li key={a.id}>
                <Link href={`/plan/${a.id}`} className="text-sm text-blue-600 hover:underline">
                  {a.id} — {a.action} ({a.progressPct}%)
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/plan/new?riskId=${risk.id}`}
          className="mt-3 inline-block text-sm font-medium text-slate-900 hover:underline"
        >
          + Добавить мероприятие для этого риска
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Редактировать риск</h2>
        <RiskForm action={updateWithId} risk={risk} />
      </div>
    </div>
  );
}
