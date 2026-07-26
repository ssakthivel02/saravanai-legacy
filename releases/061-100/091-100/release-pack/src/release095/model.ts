export interface DigitalTwin {
  twinId: string;
  environmentRef: string;
  serviceModels: string[];
  dependencyModels: string[];
  dataClassification: "synthetic" | "sanitised";
  productionCredentialsAvailable: false;
  status: "draft" | "validated" | "active" | "retired";
}

export const RELEASE_095 = {
  id: "095",
  title: "Digital Twin and Environment Simulation",
  objective: "Represent services, dependencies, capacity and failure modes in isolated non-production simulations.",
  resource: "digital-twins"
} as const;
