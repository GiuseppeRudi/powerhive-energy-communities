import {MemberType} from '../../utils/enum/MemberType';
import {Profile} from './Profile'

export interface MemberDetail {
  id: number;
  fullName: string;
  email: string;
  memberType: MemberType;
  profiles : Profile[];
}

