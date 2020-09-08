import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TicTacService {

    hiddenErrorMessage: boolean = true;

    constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

    //VERSION WEB SOCKET
    addTicTac(name: String, password: String, passwordAsk: number) {
        this.authService.setupSocketConnection();
        this.authService.socket.emit('addPartyTicTac', { name: name, password: password, passwordAsk: passwordAsk, idCrea: this.authService.idUser });
        this.authService.socket.on('tictacAdded', (data) => {
            console.log(data);
            if (data[0].id > 0) {
                this.router.navigate(['tic-tac-party/' + data[0].id]);
                this.hiddenErrorMessage = true;
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

    userEnterPartyPassword(idUser, idParty, passwordEnter){
        this.authService.setupSocketConnection();
        this.authService.socket.emit('playerEnterTicTacPassword', { idUser: idUser, idParty: idParty, passwordEnter: passwordEnter });
        this.authService.socket.on('tictacPassword', (data) => {
            if(data.data === "ok"){
                this.router.navigate(['tic-tac-party/' + idParty]);
            }else{
                this.router.navigate(['liste-parties-tictac']);
                alert("Mauvais mot de passe ! ")
            }
        })
    }



}