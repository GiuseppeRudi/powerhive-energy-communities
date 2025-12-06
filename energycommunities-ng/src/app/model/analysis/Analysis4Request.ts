import {MemberDetail} from '../member/MemberDetail';
import {BatteryDto} from '../battery/BatteryDto';

export interface Analysis4Request {
  members: MemberDetail[] ;
  batteries: BatteryDto[] ;
  budget: number ;
}
