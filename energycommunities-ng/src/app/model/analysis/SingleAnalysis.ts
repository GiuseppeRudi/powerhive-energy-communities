import {MemberDetail} from '../member/MemberDetail';


export interface SingleAnalysis {
  assignments: MemberDetail[];
  kpi1: number[];
  kpi2: number[];
  totalConsumption: number[];
  totalProduction: number[];
}
