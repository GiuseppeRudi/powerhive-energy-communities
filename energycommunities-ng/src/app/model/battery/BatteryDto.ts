import { PlanSummary } from "../plan/PlanSummary";

export interface BatteryDto {
    id: number | null,

    plan: PlanSummary | null,

    model: string,

    capacity: number,

    price: number
}
