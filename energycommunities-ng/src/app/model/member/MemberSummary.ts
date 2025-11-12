import {MemberType} from '../../utils/enum/MemberType';

export interface MemberSummary {
  id: number;
  fullName: string;
  email: string;
  memberType: MemberType;
}

