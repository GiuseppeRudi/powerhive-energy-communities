// analysis.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnalysisGuard implements CanActivate {

  constructor(private router: Router, private location: Location) {}

  canActivate(): boolean | UrlTree {
    const state = this.location.getState() as { allowAnalysis?: boolean };

    if (state && state.allowAnalysis === true) {
      return true;
    }

    return this.router.createUrlTree(['/dashboard']);
  }
}
