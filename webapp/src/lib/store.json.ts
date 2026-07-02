import { promises as fs } from "fs";
import path from "path";
import type { Risk, TreatmentAction } from "./types";
import type { Store } from "./store";
import { SEED_ACTIONS, SEED_RISKS } from "./seed-data";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

interface Db {
  risks: Risk[];
  actions: TreatmentAction[];
}

async function readDb(): Promise<Db> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Db;
  } catch {
    const initial: Db = { risks: SEED_RISKS, actions: SEED_ACTIONS };
    await writeDb(initial);
    return initial;
  }
}

async function writeDb(db: Db): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function nextId(items: { id: string }[], prefix: string): string {
  const max = items
    .map((i) => parseInt(i.id.replace(prefix, ""), 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function createJsonStore(): Store {
  return {
    async listRisks() {
      const db = await readDb();
      return db.risks;
    },
    async getRisk(id) {
      const db = await readDb();
      return db.risks.find((r) => r.id === id) ?? null;
    },
    async createRisk(input) {
      const db = await readDb();
      const risk: Risk = { ...input, id: nextId(db.risks, "R-") };
      db.risks.push(risk);
      await writeDb(db);
      return risk;
    },
    async updateRisk(id, input) {
      const db = await readDb();
      const idx = db.risks.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Risk not found");
      const updated: Risk = { ...input, id };
      db.risks[idx] = updated;
      await writeDb(db);
      return updated;
    },
    async deleteRisk(id) {
      const db = await readDb();
      db.risks = db.risks.filter((r) => r.id !== id);
      db.actions = db.actions.filter((a) => a.riskId !== id);
      await writeDb(db);
    },
    async listActions() {
      const db = await readDb();
      return db.actions;
    },
    async listActionsForRisk(riskId) {
      const db = await readDb();
      return db.actions.filter((a) => a.riskId === riskId);
    },
    async getAction(id) {
      const db = await readDb();
      return db.actions.find((a) => a.id === id) ?? null;
    },
    async createAction(input) {
      const db = await readDb();
      const action: TreatmentAction = { ...input, id: nextId(db.actions, "T-") };
      db.actions.push(action);
      await writeDb(db);
      return action;
    },
    async updateAction(id, input) {
      const db = await readDb();
      const idx = db.actions.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Action not found");
      const updated: TreatmentAction = { ...input, id };
      db.actions[idx] = updated;
      await writeDb(db);
      return updated;
    },
    async deleteAction(id) {
      const db = await readDb();
      db.actions = db.actions.filter((a) => a.id !== id);
      await writeDb(db);
    },
  };
}
