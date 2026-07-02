import postgres from "postgres";
import type { Risk, TreatmentAction } from "./types";
import type { Store } from "./store";

function riskFromRow(r: Record<string, unknown>): Risk {
  return {
    id: r.id as string,
    category: r.category as string,
    name: r.name as string,
    cause: r.cause as string,
    consequence: r.consequence as string,
    owner: r.owner as string,
    dateFound: String(r.date_found).slice(0, 10),
    inherentProbability: Number(r.inherent_probability),
    inherentImpact: Number(r.inherent_impact),
    existingControls: r.existing_controls as string,
    controlEffectiveness: r.control_effectiveness as string,
    residualProbability: Number(r.residual_probability),
    residualImpact: Number(r.residual_impact),
    strategy: r.strategy as string,
    status: r.status as string,
    nextReviewDate: String(r.next_review_date).slice(0, 10),
  };
}

function actionFromRow(r: Record<string, unknown>): TreatmentAction {
  return {
    id: r.id as string,
    riskId: r.risk_id as string,
    action: r.action as string,
    owner: r.owner as string,
    resources: r.resources as string,
    startDate: String(r.start_date).slice(0, 10),
    endDate: String(r.end_date).slice(0, 10),
    kri: r.kri as string,
    targetResidualLevel: Number(r.target_residual_level),
    status: r.status as string,
    progressPct: Number(r.progress_pct),
    comment: r.comment as string,
  };
}

async function nextId(sql: postgres.Sql, table: string, prefix: string): Promise<string> {
  const rows = await sql`SELECT id FROM ${sql(table)}`;
  const max = rows
    .map((r) => parseInt(String(r.id).replace(prefix, ""), 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function createPostgresStore(): Store {
  const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

  return {
    async listRisks() {
      const rows = await sql`SELECT * FROM risks ORDER BY id`;
      return rows.map(riskFromRow);
    },
    async getRisk(id) {
      const rows = await sql`SELECT * FROM risks WHERE id = ${id}`;
      return rows[0] ? riskFromRow(rows[0]) : null;
    },
    async createRisk(input) {
      const id = await nextId(sql, "risks", "R-");
      const rows = await sql`
        INSERT INTO risks (id, category, name, cause, consequence, owner, date_found,
          inherent_probability, inherent_impact, existing_controls, control_effectiveness,
          residual_probability, residual_impact, strategy, status, next_review_date)
        VALUES (${id}, ${input.category}, ${input.name}, ${input.cause}, ${input.consequence},
          ${input.owner}, ${input.dateFound}, ${input.inherentProbability}, ${input.inherentImpact},
          ${input.existingControls}, ${input.controlEffectiveness}, ${input.residualProbability},
          ${input.residualImpact}, ${input.strategy}, ${input.status}, ${input.nextReviewDate})
        RETURNING *`;
      return riskFromRow(rows[0]);
    },
    async updateRisk(id, input) {
      const rows = await sql`
        UPDATE risks SET category = ${input.category}, name = ${input.name}, cause = ${input.cause},
          consequence = ${input.consequence}, owner = ${input.owner}, date_found = ${input.dateFound},
          inherent_probability = ${input.inherentProbability}, inherent_impact = ${input.inherentImpact},
          existing_controls = ${input.existingControls}, control_effectiveness = ${input.controlEffectiveness},
          residual_probability = ${input.residualProbability}, residual_impact = ${input.residualImpact},
          strategy = ${input.strategy}, status = ${input.status}, next_review_date = ${input.nextReviewDate}
        WHERE id = ${id}
        RETURNING *`;
      if (!rows[0]) throw new Error("Risk not found");
      return riskFromRow(rows[0]);
    },
    async deleteRisk(id) {
      await sql`DELETE FROM treatment_actions WHERE risk_id = ${id}`;
      await sql`DELETE FROM risks WHERE id = ${id}`;
    },
    async listActions() {
      const rows = await sql`SELECT * FROM treatment_actions ORDER BY id`;
      return rows.map(actionFromRow);
    },
    async listActionsForRisk(riskId) {
      const rows = await sql`SELECT * FROM treatment_actions WHERE risk_id = ${riskId} ORDER BY id`;
      return rows.map(actionFromRow);
    },
    async getAction(id) {
      const rows = await sql`SELECT * FROM treatment_actions WHERE id = ${id}`;
      return rows[0] ? actionFromRow(rows[0]) : null;
    },
    async createAction(input) {
      const id = await nextId(sql, "treatment_actions", "T-");
      const rows = await sql`
        INSERT INTO treatment_actions (id, risk_id, action, owner, resources, start_date, end_date,
          kri, target_residual_level, status, progress_pct, comment)
        VALUES (${id}, ${input.riskId}, ${input.action}, ${input.owner}, ${input.resources},
          ${input.startDate}, ${input.endDate}, ${input.kri}, ${input.targetResidualLevel},
          ${input.status}, ${input.progressPct}, ${input.comment})
        RETURNING *`;
      return actionFromRow(rows[0]);
    },
    async updateAction(id, input) {
      const rows = await sql`
        UPDATE treatment_actions SET risk_id = ${input.riskId}, action = ${input.action},
          owner = ${input.owner}, resources = ${input.resources}, start_date = ${input.startDate},
          end_date = ${input.endDate}, kri = ${input.kri},
          target_residual_level = ${input.targetResidualLevel}, status = ${input.status},
          progress_pct = ${input.progressPct}, comment = ${input.comment}
        WHERE id = ${id}
        RETURNING *`;
      if (!rows[0]) throw new Error("Action not found");
      return actionFromRow(rows[0]);
    },
    async deleteAction(id) {
      await sql`DELETE FROM treatment_actions WHERE id = ${id}`;
    },
  };
}
