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
