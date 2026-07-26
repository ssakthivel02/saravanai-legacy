export interface DataProduct {
  productId: string;
  tenantId: string;
  name: string;
  owner: string;
  schemaRef: string;
  qualitySloIds: string[];
  consumerScopes: string[];
  version: string;
  status: "draft" | "active" | "deprecated" | "retired";
}

export const RELEASE_078 = {
  id: "078",
  title: "Data Products and Contracts",
  objective: "Create discoverable data products with owners, schemas, quality objectives, consumers, versions and deprecation plans.",
  resource: "data-products"
} as const;
