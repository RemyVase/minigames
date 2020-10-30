import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TicTacService } from '../service/tictac.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth : boolean;

  constructor(public authService : AuthService, public router: Router, private tictacService : TicTacService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    /*this.isAuthSubscription = this.authService.isAuthSubject.subscribe(
      (isAuth: boolean) =>{
        this.isAuth = isAuth;
      }
    );*/

    if(typeof sessionStorage != 'undefined') {
      this.authService.connectUser(localStorage.getItem('pseudoUser').toString(), localStorage.getItem('mdpUser').toString());
    }
  }

  onSignOut(){
    this.authService.disconnectUser();
    localStorage.clear();
  }

  ngOnDestroy(){
  }

  backToList(idParty){
    this.authService.setupSocketConnection();
    this.tictacService.userPressedBack(this.authService.idUser, idParty);
  }

}
