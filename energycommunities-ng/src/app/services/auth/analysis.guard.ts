import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AnalysisGuard implements CanActivate {

  constructor(private router: Router) {} // Rimuovi pure 'Location'

  canActivate(): boolean | UrlTree {
    // Recuperiamo la navigazione corrente che è "in volo"
    const navigation = this.router.getCurrentNavigation();

    // Leggiamo lo state dai 'extras' della navigazione
    const state = navigation?.extras.state as { allowAnalysis?: boolean };

    if (state && state.allowAnalysis === true) {
      return true;
    } else {
      console.log("Accesso negato: Nessuno state valido trovato");
      return this.router.createUrlTree(['/dashboard']);
    }
  }
}
