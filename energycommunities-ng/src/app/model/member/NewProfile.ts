import { ProfileType } from "../../utils/enum/ProfileType";

export interface NewProfile {
    id: number | null;
    profileType: ProfileType;
    graph: number[];
}