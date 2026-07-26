export interface BudgetBoundary {
  freeFirst: true;
  hardStop: true;
  maximumUnits: number;
  usedUnits: number;
}

export function budgetAvailable(value: BudgetBoundary): boolean {
  return value.freeFirst === true &&
    value.hardStop === true &&
    value.usedUnits < value.maximumUnits;
}
