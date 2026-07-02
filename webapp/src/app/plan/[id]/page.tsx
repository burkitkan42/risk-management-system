import { notFound } from "next/navigation";
import { getStore } from "@/lib/store";
import { deleteTreatmentAction, updateTreatmentAction } from "@/lib/actions";
import PlanForm from "@/components/PlanForm";

export const dynamic = "force-dynamic";

export default async function PlanActionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await getStore();
  const planAction = await store.getAction(id);
  if (!planAction) notFound();

  const risks = await store.listRisks();
  const updateWithId = updateTreatmentAction.bind(null, id);
  const deleteWithId = deleteTreatmentAction.bind(null, id, planAction.riskId);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">{planAction.id}</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Удалить мероприятие
          </button>
        </form>
      </div>
      <PlanForm action={updateWithId} risks={risks} planAction={planAction} />
    </div>
  );
}
