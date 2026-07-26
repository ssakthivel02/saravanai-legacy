export interface EventSafetyPlan {
  planId: string;
  eventId: string;
  country: string;
  expectedAttendance: number;
  emergencyContacts: string[];
  weatherPlan: string;
  crowdPlan: string;
  accessibilityPlan: string;
  childSafetyPlan: string;
  approvedBy: string | undefined;
}

export const RELEASE_084 = {
  id: "084",
  title: "Public Event and Emergency Safety",
  objective: "Provide crowd, weather, transport, accessibility, child safety, emergency access and escalation controls for public events.",
  resource: "event-safety-plans"
} as const;
