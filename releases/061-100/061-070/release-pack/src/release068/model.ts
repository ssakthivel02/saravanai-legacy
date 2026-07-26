export interface ScenarioDefinition {
  scenarioId: string;
  tenantId: string;
  name: string;
  assumptions: string[];
  probability: number;
  dependencies: string[];
  productionSideEffects: false;
  approved: boolean;
}

export const RELEASE_068 = {
  id: "068",
  title: "Scenario Planning and Simulation",
  objective: "Create bounded what-if scenarios with explicit assumptions, probabilities, dependencies, constraints and no production side effects.",
  resource: "scenario-definitions"
} as const;
