import PlanForm from "@/components/PlanForm";
import { createTreatmentAction } from "@/lib/actions";
import { getStore } from "@/lib/store";

export default async function NewPlanActionPage({
  searchParams,
}: {
  searchParams: Promise<{ riskId?: string }>;
}) {
  const { riskId } = await searchParams;
  const store = await getStore();
  const risks = await store.listRisks();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Новое мероприятие</h1>
      <PlanForm action={createTreatmentAction} risks={risks} defaultRiskId={riskId} />
    </div>
  );
}
