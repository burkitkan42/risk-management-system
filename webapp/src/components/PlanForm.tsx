import { PLAN_STATUSES } from "@/lib/reference";
import type { Risk, TreatmentAction } from "@/lib/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none";

export default function PlanForm({
  action,
  risks,
  planAction,
  defaultRiskId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  risks: Risk[];
  planAction?: TreatmentAction;
  defaultRiskId?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Риск">
          <select
            name="riskId"
            defaultValue={planAction?.riskId ?? defaultRiskId}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Выберите риск
            </option>
            {risks.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ответственный">
          <input name="owner" defaultValue={planAction?.owner} required className={inputClass} />
        </Field>
      </div>

      <Field label="Мероприятие / действие">
        <textarea name="action" defaultValue={planAction?.action} rows={2} required className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ресурсы / бюджет">
          <input name="resources" defaultValue={planAction?.resources} className={inputClass} />
        </Field>
        <Field label="KRI / индикатор контроля">
          <input name="kri" defaultValue={planAction?.kri} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Дата начала">
          <input type="date" name="startDate" defaultValue={planAction?.startDate} required className={inputClass} />
        </Field>
        <Field label="Дата завершения">
          <input type="date" name="endDate" defaultValue={planAction?.endDate} required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Целевой остаточный уровень">
          <input
            type="number"
            min={1}
            max={25}
            name="targetResidualLevel"
            defaultValue={planAction?.targetResidualLevel ?? 6}
            className={inputClass}
          />
        </Field>
        <Field label="Статус выполнения">
          <select name="status" defaultValue={planAction?.status ?? "Не начато"} className={inputClass}>
            {PLAN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="% выполнения">
          <input
            type="number"
            min={0}
            max={100}
            name="progressPct"
            defaultValue={planAction?.progressPct ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Комментарии">
        <textarea name="comment" defaultValue={planAction?.comment} rows={2} className={inputClass} />
      </Field>

      <button
        type="submit"
        className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        {planAction ? "Сохранить изменения" : "Создать мероприятие"}
      </button>
    </form>
  );
}
