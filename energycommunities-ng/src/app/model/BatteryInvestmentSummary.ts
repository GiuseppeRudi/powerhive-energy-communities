export interface BatteryInvestmentSummary {
  annualCostWithoutBattery: number;
  annualCostWithBattery: number;
  annualSavings: number;
  batteryInvestment: number;
  paybackYears: number | null; // null = non rientri mai
  isConvenient: boolean;
}
