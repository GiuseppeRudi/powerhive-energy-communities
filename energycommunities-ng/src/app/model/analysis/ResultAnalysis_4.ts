import {SingleAnalysis} from './SingleAnalysis';
import {MemberDetail} from '../member/MemberDetail';
import {BatteryDto} from '../battery/BatteryDto';
import {BatteryStatusDto} from '../battery/BatteryStatusDto';


export interface ResultAnalysis_4 {
  assignments: Map<number,number>;
  kpi1: number[];
  kpi2: number[];
  totalConsumption: number[];
  totalProduction: number[];
  startingCommunity: SingleAnalysis;
  batteries: BatteryDto[];
  batteryStatus: BatteryStatusDto[];
}

export function isResultAnalysis4(x: any): x is ResultAnalysis_4 {
  return x !== null && typeof x === 'object'
    && Array.isArray(x.kpi1)
    && Array.isArray(x.kpi2)
    && Array.isArray(x.totalConsumption)
    && Array.isArray(x.totalProduction)
    && typeof x.startingCommunity === 'object' && x.startingCommunity !== null
    && Array.isArray(x.batteries)
    && Array.isArray(x.batteryStatus);
}
