import {MemberDetail} from '../member/MemberDetail';
import {Input} from '@angular/core';

export interface Analysis3Request {
  members: MemberDetail[] | undefined;
  wantToRemove: number[] | undefined;
  wantToAdd: number[] | undefined;
}
