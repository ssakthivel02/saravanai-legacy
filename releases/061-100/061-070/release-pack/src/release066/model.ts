export interface OntologyContract {
  contractId: string;
  namespace: string;
  version: string;
  classIds: string[];
  relationshipIds: string[];
  status: "draft" | "approved" | "deprecated";
  approvedBy: string | undefined;
}

export const RELEASE_066 = {
  id: "066",
  title: "Enterprise Ontology and Semantic Contracts",
  objective: "Govern namespaces, classes, relationships, temporal validity and persistent identifiers for enterprise knowledge interoperability.",
  resource: "ontology-contracts"
} as const;
