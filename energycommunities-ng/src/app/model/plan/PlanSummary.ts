import {MemberSummary} from '../member/MemberSummary';

export interface PlanSummary {
  id: number;
  members: MemberSummary[];
}
