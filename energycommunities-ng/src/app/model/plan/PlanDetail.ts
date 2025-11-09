import {MemberDetail} from '../member/MemberDetail';

export interface PlanDetail {
  id: number;
  members: MemberDetail[];
}
