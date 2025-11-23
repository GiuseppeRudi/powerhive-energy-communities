import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BatteryDto } from "../model/battery/BatteryDto";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BatteryService {

    private readonly baseUrl = 'http://localhost:8080/battery'
    constructor(private readonly http: HttpClient) { }

    add_battery(plan_id: number, battery: BatteryDto): Observable<BatteryDto> {
        const battery_dto: BatteryDto = {
            id: null,
            plan: null,
            model: battery.model,
            capacity: battery.capacity,
            price: battery.price
        }

        return this.http.post<BatteryDto>(`${this.baseUrl}/plan/${plan_id}`, battery_dto);
    }

    get_battery(battery_id: number): Observable<BatteryDto> {
        return this.http.get<BatteryDto>(`${this.baseUrl}/${battery_id}`);
    }

    delete_battery(battery_id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${battery_id}`);
    }

    get_batteries_by_plan(plan_id: number): Observable<BatteryDto[]> {
        return this.http.get<BatteryDto[]>(`${this.baseUrl}/all/${plan_id}`);
    }
}