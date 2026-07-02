export interface Risk {
  id: string;
  category: string;
  name: string;
  cause: string;
  consequence: string;
  owner: string;
  dateFound: string;
  inherentProbability: number;
  inherentImpact: number;
  existingControls: string;
  controlEffectiveness: string;
  residualProbability: number;
  residualImpact: number;
  strategy: string;
  status: string;
  nextReviewDate: string;
}

export interface TreatmentAction {
  id: string;
  riskId: string;
  action: string;
  owner: string;
  resources: string;
  startDate: string;
  endDate: string;
  kri: string;
  targetResidualLevel: number;
  status: string;
  progressPct: number;
  comment: string;
}

export type RiskInput = Omit<Risk, "id">;
export type TreatmentActionInput = Omit<TreatmentAction, "id">;
