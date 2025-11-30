import { MemberType } from "../../utils/enum/MemberType";
import { NewProfile } from "./NewProfile";

export interface NewMember {
    id: number | null,
    fullName: string,
    email: string,
    memberType: MemberType | null,
    profiles: NewProfile[],
    plan_id: number,

    any_conflicts: Conflict | null
}

export type Conflict = 'EMAIL_ALREADY_USED' | 'MEMBER_ALREADY_PRESENT' | 'ONGOING_ANALYSIS' | 'NO_CONFLICTS'