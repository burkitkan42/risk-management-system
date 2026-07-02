"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getStore } from "./store";
import type { RiskInput, TreatmentActionInput } from "./types";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function num(fd: FormData, key: string): number {
  return Number(fd.get(key) ?? 0);
}

function riskInputFromForm(fd: FormData): RiskInput {
  return {
    category: str(fd, "category"),
    name: str(fd, "name"),
    cause: str(fd, "cause"),
    consequence: str(fd, "consequence"),
    owner: str(fd, "owner"),
    dateFound: str(fd, "dateFound"),
    inherentProbability: num(fd, "inherentProbability"),
    inherentImpact: num(fd, "inherentImpact"),
    existingControls: str(fd, "existingControls"),
    controlEffectiveness: str(fd, "controlEffectiveness"),
    residualProbability: num(fd, "residualProbability"),
    residualImpact: num(fd, "residualImpact"),
    strategy: str(fd, "strategy"),
    status: str(fd, "status"),
    nextReviewDate: str(fd, "nextReviewDate"),
  };
}

function actionInputFromForm(fd: FormData): TreatmentActionInput {
  return {
    riskId: str(fd, "riskId"),
    action: str(fd, "action"),
    owner: str(fd, "owner"),
    resources: str(fd, "resources"),
    startDate: str(fd, "startDate"),
    endDate: str(fd, "endDate"),
    kri: str(fd, "kri"),
    targetResidualLevel: num(fd, "targetResidualLevel"),
    status: str(fd, "status"),
    progressPct: num(fd, "progressPct"),
    comment: str(fd, "comment"),
  };
}

export async function createRisk(formData: FormData) {
  const store = await getStore();
  const risk = await store.createRisk(riskInputFromForm(formData));
  revalidatePath("/risks");
  revalidatePath("/");
  redirect(`/risks/${risk.id}`);
}

export async function updateRisk(id: string, formData: FormData) {
  const store = await getStore();
  await store.updateRisk(id, riskInputFromForm(formData));
  revalidatePath("/risks");
  revalidatePath(`/risks/${id}`);
  revalidatePath("/");
  redirect(`/risks/${id}`);
}

export async function deleteRisk(id: string) {
  const store = await getStore();
  await store.deleteRisk(id);
  revalidatePath("/risks");
  revalidatePath("/plan");
  revalidatePath("/");
  redirect("/risks");
}

export async function createTreatmentAction(formData: FormData) {
  const store = await getStore();
  const action = await store.createAction(actionInputFromForm(formData));
  revalidatePath("/plan");
  revalidatePath(`/risks/${action.riskId}`);
  redirect(`/plan/${action.id}`);
}

export async function updateTreatmentAction(id: string, formData: FormData) {
  const store = await getStore();
  const action = await store.updateAction(id, actionInputFromForm(formData));
  revalidatePath("/plan");
  revalidatePath(`/risks/${action.riskId}`);
  redirect(`/plan/${id}`);
}

export async function deleteTreatmentAction(id: string, riskId: string) {
  const store = await getStore();
  await store.deleteAction(id);
  revalidatePath("/plan");
  revalidatePath(`/risks/${riskId}`);
  redirect("/plan");
}
