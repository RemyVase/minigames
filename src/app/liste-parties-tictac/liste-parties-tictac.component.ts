import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TicTacService } from '../service/tictac.service';

@Component({
  selector: 'app-liste-parties-tictac',
  templateUrl: './liste-parties-tictac.component.html',
  styleUrls: ['./liste-parties-tictac.component.scss']
})
export class ListePartiesTictacComponent implements OnInit {

  constructor(public authService: AuthService, private tictacService: TicTacService) { }

  ngOnInit(): void {

  }

  enterParty(idUser, idParty){
    this.tictacService.userEnterParty(idUser, idParty);
  }

  enterPartyPassword(idUser, idParty){
    var passwordEnter = prompt('Entrez le mot de passe');
    this.tictacService.userEnterPartyPassword(idUser, idParty, passwordEnter);
  }

}
