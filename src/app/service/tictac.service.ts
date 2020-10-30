import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class TicTacService {

    hiddenErrorMessage: boolean = true;

    constructor(private router: Router, private authService: AuthService) { }



    //VERSION WEB SOCKET
    addTicTac(name: String, password: String, passwordAsk: number) {
        this.authService.setupSocketConnection();
        
        this.authService.socket.emit('addPartyTicTac', { name: name, password: password, passwordAsk: passwordAsk, idCrea: this.authService.idUser });
        //console.log('CREATION DE PARTIE');
        
        this.authService.socket.on('tictacAdded', (data) => {
                console.log(data);
                console.log("OKKKKK tictacAdded");
                if (data[0].id > 0) {
                    //ENVOIE FULL REQUETE MAIS POURQUOI ? 
                    //console.log('CREATION DE PARTIE222222222');
                    this.authService.socket.emit('getIdPartyOfUser', { idCrea: this.authService.idUser });
                    this.authService.socket.on('returnIdPartyUser', (data2) => {
                    this.router.navigate(['tic-tac-party/' + data2.idParty]);
                    this.hiddenErrorMessage = true;

                    });
    
                } else {
                    if (data[0].id == -1) {
                        this.hiddenErrorMessage = false;
                    }
                }
        });
    }

    userPressedBack(idUser, idParty) {
        this.authService.setupSocketConnection();
        this.authService.socket.emit('checkIfCreatorTicTac', { idUser: idUser, idParty: idParty });
    }

    userEnterParty(idUser, idParty) {
        this.authService.setupSocketConnection();
        this.authService.socket.emit('playerEnterTicTac', { idUser: idUser, idParty: idParty });
    }

    userEnterPartyPassword(idUser, idParty, passwordEnter) {
        this.authService.setupSocketConnection();
        this.authService.socket.emit('playerEnterTicTacPassword', { idUser: idUser, idParty: idParty, passwordEnter: passwordEnter });
        this.authService.socket.on('tictacPassword', (data) => {
            if (data.data === "ok") {
                this.router.navigate(['tic-tac-party/' + idParty]);
            } else {
                this.router.navigate(['liste-parties-tictac']);
                alert("Mauvais mot de passe ! ")
            }
        });
    }

    addPoint(player, idParty) {
        this.authService.setupSocketConnection();
        console.log(player + "Point Ajout");
        this.authService.socket.emit('addPointTicTac', { pseudoPlayer: player, idParty: idParty });
    }

    subtractPoint(player, idParty) {
        this.authService.setupSocketConnection();
        console.log(player + "Point Suppress");
        this.authService.socket.emit('substractPointTicTac', { pseudoPlayer: player, idParty: idParty });
    }
}