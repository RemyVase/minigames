import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { TicTacService } from '../service/tictac.service';

@Component({
  selector: 'app-tic-tac-party',
  templateUrl: './tic-tac-party.component.html',
  styleUrls: ['./tic-tac-party.component.scss']
})
export class TicTacPartyComponent implements OnInit {

  id: number;
  nameRoom: String;
  pseudoPlayer1: String;
  pseudoPlayer2: String;
  role: string;
  currentPlayer: string = "O";
  currentParty: any = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "" };
  readyPlayer1: boolean = false;
  readyPlayer2: boolean = false;
  partyFinish: boolean = false;
  winnerPlayer: string = "";

  constructor(private route: ActivatedRoute, private location: PlatformLocation, public authService: AuthService, private tictacService: TicTacService) {
    //Permet de savoir si la personne à appuyer sur précédent
    location.onPopState(() => {
      this.tictacService.userPressedBack(this.authService.idUser, this.id);
    });
  }

  ngOnInit(): void {
    let getId = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    this.getAllInfosForTheRoom(this.id);
  }

  getAllInfosForTheRoom(id) {
    this.authService.setupSocketConnection();
    this.authService.socket.emit('needAllInfoRoomTicTac', { idParty: id });

    this.authService.socket.on('returnAllInfoRoomTicTac', (data) => {
      if (data[1] === undefined) {
        this.nameRoom = data[0].name;
        this.pseudoPlayer1 = data[0].pseudo;
        this.pseudoPlayer2 = "";
      } else {
        this.nameRoom = data[0].name;
        this.pseudoPlayer1 = data[0].pseudo;
        this.pseudoPlayer2 = data[1].pseudo;
      }
      if (this.authService.pseudoUser === this.pseudoPlayer1) {
        this.role = "O";
      } else if (this.authService.pseudoUser === this.pseudoPlayer2) {
        this.role = "X";
      }
    });

    this.authService.socket.on('newTicTacPlayer', (data) => {
      this.currentPlayer = data.role;
    });

    this.authService.socket.on('playerTicTacReadyStatus', (data) => {
      if (data.player1 != undefined) {
        this.readyPlayer1 = data.player1;
      }
      if (data.player2 != undefined) {
        this.readyPlayer2 = data.player2;
      }

      if (this.readyPlayer2 === true && this.readyPlayer1 === true){
        this.partyFinish = false;
        this.currentParty = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "" };
      }
    });

    this.authService.socket.on('currentParty', (data) => {
      this.currentParty = data.currentParty;
      this.checkIfWin(this.currentParty);
    });
  }

  clickButton(role, idButton) {
    //Modifie la valeur de l'array et reste plus qu'à l'envoyer sur le serveur pour transmettre à tout le monde.
    this.currentParty[idButton] = role;

    this.authService.socket.emit('tictacPlayer', { role: role, idParty: this.id, currentParty: this.currentParty });

  }

  PlayerReady(id) {
    this.authService.socket.emit('playerTicTacReady', { idPlayer: id, idParty: this.id });
    console.log('test');
  }

  PlayerNotReady(id) {
    this.authService.socket.emit('playerTicTacNotReady', { idPlayer: id, idParty: this.id });
  }

  checkIfWin(party){
    if(party[1] != "" && party[1] === party[2] && party[1] === party[3]){
      this.partyFinish = true;
      this.winnerPlayer = party[1];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[4] != "" && party[4] === party[5] && party[4] === party[6]){
      this.partyFinish = true;
      this.winnerPlayer = party[4];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[7] != "" && party[7] === party[8] && party[7] === party[9]){
      this.partyFinish = true;
      this.winnerPlayer = party[7];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[1] != "" && party[1] === party[4] && party[1] === party[7]){
      this.partyFinish = true;
      this.winnerPlayer = party[1];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[2] != "" && party[2] === party[5] && party[2] === party[8]){
      this.partyFinish = true;
      this.winnerPlayer = party[2];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[3] != "" && party[3] === party[6] && party[3] === party[9]){
      this.partyFinish = true;
      this.winnerPlayer = party[3];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[1] != "" && party[1] === party[5] && party[1] === party[9]){
      this.partyFinish = true;
      this.winnerPlayer = party[1];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[3] != "" && party[3] === party[5] && party[3] === party[7]){
      this.partyFinish = true;
      this.winnerPlayer = party[3];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else if(party[1] != "" && party[2] != "" && party[3] != "" && party[4] != "" && party[5] != "" && party[6] != "" && party[7] != "" && party[8] != "" && party[9] != ""){
      this.partyFinish = true;
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    }else{

    }
  }
}
