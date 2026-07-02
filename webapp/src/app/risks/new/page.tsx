import RiskForm from "@/components/RiskForm";
import { createRisk } from "@/lib/actions";

export default function NewRiskPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Новый риск</h1>
      <RiskForm action={createRisk} />
    </div>
  );
}
