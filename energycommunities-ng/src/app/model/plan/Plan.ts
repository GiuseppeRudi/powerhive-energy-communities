import {MemberSummary} from '../member/MemberSummary';

export interface Plan {
  id: number;
  members: MemberSummary[];
}
