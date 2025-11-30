import {MemberType} from '../../utils/enum/MemberType';
import { OngoingAnalysis } from '../analysis/OngoingAnalysis';
import {Profile} from './Profile'

export interface MemberDetail {
  id: number;
  fullName: string;
  email: string;
  memberType: MemberType;
  profiles : Profile[];
  ongoingAnalysis: OngoingAnalysis[] | null | undefined,
  plan_id: number;
}

