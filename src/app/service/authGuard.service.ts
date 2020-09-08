import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise(
            (resolve, reject) => {
                if (this.authService.isAuth === true) {
                    resolve(true);
                } else {
                    this.router.navigate(['/auth', 'signin']);
                    resolve(false);
                }

            }
        )
    }
}