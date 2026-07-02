import {
  CATEGORIES,
  CONTROL_EFFECTIVENESS,
  RISK_STATUSES,
  SCORE_SCALE,
  STRATEGIES,
} from "@/lib/reference";
import type { Risk } from "@/lib/types";

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

export default function RiskForm({
  action,
  risk,
}: {
  action: (formData: FormData) => void | Promise<void>;
  risk?: Risk;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Категория">
          <select name="category" defaultValue={risk?.category} required className={inputClass}>
            <option value="" disabled>
              Выберите категорию
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Владелец риска">
          <input name="owner" defaultValue={risk?.owner} required className={inputClass} />
        </Field>
      </div>

      <Field label="Наименование риска">
        <input name="name" defaultValue={risk?.name} required className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Причина возникновения">
          <textarea name="cause" defaultValue={risk?.cause} rows={2} className={inputClass} />
        </Field>
        <Field label="Последствия / влияние">
          <textarea name="consequence" defaultValue={risk?.consequence} rows={2} className={inputClass} />
        </Field>
      </div>

      <Field label="Дата выявления">
        <input type="date" name="dateFound" defaultValue={risk?.dateFound} required className={inputClass} />
      </Field>

      <fieldset className="rounded-md border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">Присущий (inherent) риск</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Вероятность (1-5)">
            <select name="inherentProbability" defaultValue={risk?.inherentProbability ?? 3} className={inputClass}>
              {SCORE_SCALE.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Влияние (1-5)">
            <select name="inherentImpact" defaultValue={risk?.inherentImpact ?? 3} className={inputClass}>
              {SCORE_SCALE.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Существующие меры контроля">
          <textarea name="existingControls" defaultValue={risk?.existingControls} rows={2} className={inputClass} />
        </Field>
        <Field label="Эффективность контролей">
          <select name="controlEffectiveness" defaultValue={risk?.controlEffectiveness} required className={inputClass}>
            <option value="" disabled>
              Выберите
            </option>
            {CONTROL_EFFECTIVENESS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="rounded-md border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">Остаточный (residual) риск</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Вероятность (1-5)">
            <select name="residualProbability" defaultValue={risk?.residualProbability ?? 3} className={inputClass}>
              {SCORE_SCALE.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Влияние (1-5)">
            <select name="residualImpact" defaultValue={risk?.residualImpact ?? 3} className={inputClass}>
              {SCORE_SCALE.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Стратегия реагирования">
          <select name="strategy" defaultValue={risk?.strategy} required className={inputClass}>
            <option value="" disabled>
              Выберите
            </option>
            {STRATEGIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Статус риска">
          <select name="status" defaultValue={risk?.status} required className={inputClass}>
            <option value="" disabled>
              Выберите
            </option>
            {RISK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Дата следующего пересмотра">
          <input type="date" name="nextReviewDate" defaultValue={risk?.nextReviewDate} required className={inputClass} />
        </Field>
      </div>

      <button
        type="submit"
        className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        {risk ? "Сохранить изменения" : "Создать риск"}
      </button>
    </form>
  );
}
