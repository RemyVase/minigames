import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  getId: any;

  nameRoom: String;
  pseudoPlayer1: String;
  pseudoPlayer2: String;
  pointsPlayer1: number;
  pointsPlayer2: number;

  role: string;
  currentPlayer: string = "O";
  currentParty: any = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "" };

  readyPlayer1: boolean = false;
  readyPlayer2: boolean = false;

  partyFinish: boolean = false;
  partyBegin: boolean = false;
  winnerPlayer: string = "";

  currentTime: number = 60;
  timeElapsed: number = 0;

  count: number = 0;


  constructor(private route: ActivatedRoute, private location: PlatformLocation, public authService: AuthService, private tictacService: TicTacService, private router: Router) {
    //Permet de savoir si la personne à appuyer sur précédent
    location.onPopState(() => {
      this.tictacService.userPressedBack(this.authService.idUser, this.id);

    });
  }

  ngOnDestroy(){
     this.authService.socket.removeAllListeners('tictacAdded');
     this.authService.socket.removeListener('playerHasLeftPartyTicTac', this.playerLeftParty);
  }

  ngOnInit(): void {
    this.count++;
    console.log(this.count);
    this.getId = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    console.log(this.id);
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
        this.pointsPlayer1 = data[0].ticTacPoints;
      } else {
        this.nameRoom = data[0].name;
        this.pseudoPlayer1 = data[0].pseudo;
        this.pseudoPlayer2 = data[1].pseudo;
        this.pointsPlayer1 = data[0].ticTacPoints;
        this.pointsPlayer2 = data[1].ticTacPoints;
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

      if (this.readyPlayer2 === true && this.readyPlayer1 === true) {
        this.partyFinish = false;
        this.partyBegin = true;
        this.currentParty = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "" };
        clearInterval(this.timeElapsed);
        this.clock();
      }
    });

    this.authService.socket.on('currentParty', (data) => {
      this.currentParty = data.currentParty;
      this.checkIfWin(this.currentParty);
      clearInterval(this.timeElapsed);
      if (this.partyFinish === true) {
        this.calculPoint();
      } else {
        this.clock();
      }
    });

    this.authService.socket.on('playerHasLeftPartyTicTac', this.playerLeftParty);
  }

  playerLeftParty = (data) => {
    //Ici on gère ceux qui quitte pour leur retirer des points
    if (this.pseudoPlayer1 === data.pseudo) {
      if (this.readyPlayer1 === true && this.readyPlayer2 === true) {
        this.authService.setupSocketConnection();
        this.tictacService.addPoint(this.pseudoPlayer2, this.id);
        this.tictacService.subtractPoint(this.pseudoPlayer1, this.id);
        this.readyPlayer2 = false;
        this.readyPlayer1 = false;
      } else {
        this.readyPlayer2 = false;
        this.readyPlayer1 = false;
      }
      //this.authService.socket.emit('needAllInfoRoomTicTac', { idParty: this.id });
    } else {
      if (this.readyPlayer1 === true && this.readyPlayer2 === true) {
        this.authService.setupSocketConnection();
        this.tictacService.addPoint(this.pseudoPlayer1, this.id);
        this.tictacService.subtractPoint(this.pseudoPlayer2, this.id);
        this.pseudoPlayer2 = "";
        this.pointsPlayer2 = 0;
        this.readyPlayer2 = false;
        this.readyPlayer1 = false;
      } else {
        this.pseudoPlayer2 = "";
        this.readyPlayer2 = false;
        this.pointsPlayer2 = 0;
        this.readyPlayer1 = false;
      }
      //this.authService.socket.emit('needAllInfoRoomTicTac', { idParty: this.id });
    }
  }

  clickButton(role, idButton) {
    //Modifie la valeur de l'array et reste plus qu'à l'envoyer sur le serveur pour transmettre à tout le monde.
    this.currentParty[idButton] = role;
    this.authService.socket.emit('tictacPlayer', { role: role, idParty: this.id, currentParty: this.currentParty });
  }

  PlayerReady(id) {
    this.authService.socket.emit('playerTicTacReady', { idPlayer: id, idParty: this.id });
  }

  PlayerNotReady(id) {
    this.authService.socket.emit('playerTicTacNotReady', { idPlayer: id, idParty: this.id });
  }

  checkIfWin(party) {
    if (party[1] != "" && party[1] === party[2] && party[1] === party[3]) {
      this.partyFinish = true;
      this.winnerPlayer = party[1];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[4] != "" && party[4] === party[5] && party[4] === party[6]) {
      this.partyFinish = true;
      this.winnerPlayer = party[4];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[7] != "" && party[7] === party[8] && party[7] === party[9]) {
      this.partyFinish = true;
      this.winnerPlayer = party[7];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[1] != "" && party[1] === party[4] && party[1] === party[7]) {
      this.partyFinish = true;
      this.winnerPlayer = party[1];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[2] != "" && party[2] === party[5] && party[2] === party[8]) {
      this.partyFinish = true;
      this.winnerPlayer = party[2];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[3] != "" && party[3] === party[6] && party[3] === party[9]) {
      this.partyFinish = true;
      this.winnerPlayer = party[3];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[1] != "" && party[1] === party[5] && party[1] === party[9]) {
      this.partyFinish = true;
      this.winnerPlayer = party[1];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[3] != "" && party[3] === party[5] && party[3] === party[7]) {
      this.partyFinish = true;
      this.winnerPlayer = party[3];
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else if (party[1] != "" && party[2] != "" && party[3] != "" && party[4] != "" && party[5] != "" && party[6] != "" && party[7] != "" && party[8] != "" && party[9] != "") {
      this.partyFinish = true;
      this.readyPlayer2 = false;
      this.readyPlayer1 = false;
    } else {

    }
  }

  clock() {
    this.currentTime = 60;
    let time = 0;
    this.timeElapsed = setInterval(() => {
      if (time < 60) {
        time += 1;
        this.currentTime -= 1;
      } else {
        time = 0;
        this.currentTime = 60;
        this.partyFinish = true;
        if (this.currentPlayer === "X") {
          this.winnerPlayer = "O";
        } else {
          this.winnerPlayer = "X";
        }
        clearInterval(this.timeElapsed);
      }
    }, 1000)
  }

  calculPoint() {
    if (this.role == this.winnerPlayer) {
      if (this.role === "O") {
        this.tictacService.addPoint(this.pseudoPlayer1, this.id);
      } else {
        this.tictacService.addPoint(this.pseudoPlayer2, this.id);
      }
    } else if (this.role != this.winnerPlayer) {
      if (this.role === "O") {
        this.tictacService.subtractPoint(this.pseudoPlayer1, this.id);
      } else {
        this.tictacService.subtractPoint(this.pseudoPlayer2, this.id);
      }
    }
  }
  
}
