import type { Risk, RiskInput, TreatmentAction, TreatmentActionInput } from "./types";

export interface Store {
  listRisks(): Promise<Risk[]>;
  getRisk(id: string): Promise<Risk | null>;
  createRisk(input: RiskInput): Promise<Risk>;
  updateRisk(id: string, input: RiskInput): Promise<Risk>;
  deleteRisk(id: string): Promise<void>;
  listActions(): Promise<TreatmentAction[]>;
  listActionsForRisk(riskId: string): Promise<TreatmentAction[]>;
  getAction(id: string): Promise<TreatmentAction | null>;
  createAction(input: TreatmentActionInput): Promise<TreatmentAction>;
  updateAction(id: string, input: TreatmentActionInput): Promise<TreatmentAction>;
  deleteAction(id: string): Promise<void>;
}

let storePromise: Promise<Store> | null = null;

export function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = process.env.DATABASE_URL
      ? import("./store.postgres").then((m) => m.createPostgresStore())
      : import("./store.json").then((m) => m.createJsonStore());
  }
  return storePromise;
}
