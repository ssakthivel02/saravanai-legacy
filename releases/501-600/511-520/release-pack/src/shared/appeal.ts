export interface AppealRecord {
  appealId: string;
  originalDecisionId: string;
  submittedBy: string;
  grounds: string[];
  evidenceRefs: string[];
  independentReviewer: string;
  outcome: "pending" | "upheld" | "changed" | "withdrawn";
}
