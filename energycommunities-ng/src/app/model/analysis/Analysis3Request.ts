import {MemberDetail} from '../member/MemberDetail';
import {Input} from '@angular/core';

export interface Analysi3Request {
  members: MemberDetail[] | undefined;
  wantToRemove: number[] | undefined;
  wantToAdd: number[] | undefined;
}
