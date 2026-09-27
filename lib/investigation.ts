export const INVESTIGATION_KEY = "bhudrishti-investigation";

export type InvestigationState = {
  siteId: string;
  location: string;
  changeType: string;
  confidence: number;
};

export const defaultInvestigation: InvestigationState = {
  siteId: "site-001",
  location: "Narmada Basin — Sector A",
  changeType: "Construction",
  confidence: 91,
};

export function saveInvestigation(
  investigation: InvestigationState
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    INVESTIGATION_KEY,
    JSON.stringify(investigation)
  );
}

export function getInvestigation(): InvestigationState {
  if (typeof window === "undefined") {
    return defaultInvestigation;
  }

  const stored = localStorage.getItem(INVESTIGATION_KEY);

  if (!stored) {
    return defaultInvestigation;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return defaultInvestigation;
  }
}