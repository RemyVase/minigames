import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';
import { TicTacService } from './tictac.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    opened: boolean = false;
    connected: boolean = false;
    socket;
    isAuth: Boolean = false;
    isAuthSubject = new Subject<Boolean>();
    errorRegister: Boolean = false;
    isHiddenRegister: boolean = true;
    errorLogin: boolean = false;
    isHiddenLogin: boolean = true;

    errorChangePassword: boolean = false;
    isHiddenErrorChange: boolean = true;
    
    allUsersConnected;
    allTicTacParty;

    pseudoUser: String;
    idUser: String;
    emailUser: String;

    emitIsAuth() {
        this.isAuthSubject.next(this.isAuth);
    }

    constructor(private httpClient: HttpClient, private router: Router) { }

    //CONNECT WEBSOCKET
    setupSocketConnection() {

        if (!this.opened) {
          this.socket = io.connect('http://localhost:8080');
    
          this.socket.on('connect', () => {
            this.opened = true;
            this.subscribeAllUsersConnected();
            this.subscribeAllTicTacParty();
            this.subscribeIdAndEmailUser();
            this.subscribeRoomsInfos();
          });
    
          this.socket.on('disconnect', (reason) => {
            console.warn(reason);
            this.opened = false;
            this.connected = false;
            this.pseudoUser = "";
            this.isAuth = false;
          });
    
          this.socket.on('authenticated', () => {
            this.connected = true;
            this.isAuth = true;
            this.errorLogin = false;
            this.isHiddenLogin = false;
            this.router.navigate(['mainmenu']);
          });
          
          this.socket.on('unauthorized', () => {
            this.isHiddenLogin = false;
            this.errorLogin = true;
            this.pseudoUser = "";
          });
        } else {
          console.error("Socket is already open");
        }
      }

    //VERSION WEB SOCKET
    connectUser(pseudo: String, password: String) {
        this.setupSocketConnection();

        this.pseudoUser = pseudo;
        this.socket.emit('authentication', { username: pseudo, password: password });
        localStorage.setItem("mdpUser", password.toString());
    }


    addUser(pseudo: String, email: String, password: String) {
        this.setupSocketConnection();

        this.socket.emit('register', { username: pseudo, email: email, password: password });

        this.socket.on('registered', (data) => {
            if(data.ok === "ok"){
                this.errorRegister = false;
                this.isHiddenRegister = false;
                this.router.navigate(['/auth/signin']);
            } else {
                this.errorRegister = true;
                this.isHiddenRegister = false;
            }
            
        });
    }

    disconnectUser() {
        this.socket.emit('decoUser', {username: this.pseudoUser});
        this.isAuth = false;
        this.emitIsAuth();
    }

    subscribeAllUsersConnected(){
        this.setupSocketConnection();
        this.socket.on('allUsersConnected', (data) => {
            this.allUsersConnected = data.usersConnected;
        });
    }

    subscribeAllTicTacParty(){
        this.setupSocketConnection();
        this.socket.emit('getAllTicTacParty');
        this.socket.on('allTicTacParty', (data) => {
            this.allTicTacParty = data;
            console.log(this.allTicTacParty);
        });
    }

    subscribeIdAndEmailUser(){
        this.setupSocketConnection();
        this.socket.on('getIdUser', (data) => {
            this.idUser = data[0].id_user;
            this.emailUser = data[0].email;
            localStorage.setItem("pseudoUser", this.pseudoUser.toString());
            localStorage.setItem("emailUser", this.emailUser.toString());
            localStorage.setItem("idUser", this.idUser.toString());
        });
    }

    changePassword(pseudo, oldPassword, newPassword){
        this.setupSocketConnection();
        this.socket.emit('changePassword', {pseudo: pseudo, oldPassword: oldPassword, newPassword: newPassword});
        this.socket.on('changingPassword', (data) => {
            if(data.data === "ok"){
                localStorage.setItem("mdpUser", newPassword);
                this.errorChangePassword = false;
                this.isHiddenErrorChange = false;
            } else{
                this.errorChangePassword = true;
                this.isHiddenErrorChange = false;
            }
        })
    }

    subscribeRoomsInfos(){
        this.setupSocketConnection();
        this.socket.on('playerEnterInRoom', (data) => {
            alert(data.data);
        });
        this.socket.on('playerLeaveRoom', (data) => {
            alert(data.data);
        });
    }

}


    // VERSION PHP
    /*
    connectUser(pseudo: String, password: String) {
        const compte = {
            pseudo: pseudo,
            password: password
        };
        return new Promise(
            (resolve, reject) => {
                this.httpClient
                    .post('http://localhost:8878/mini-jeu/php/connexion.php', compte)
                    .subscribe(
                        (response) => {
                            resolve(response);
                            if(response === "ok"){
                                this.isAuth = true;
                            }else{
                                this.isAuth = false;
                            }
                            this.emitIsAuth();
                        },
                        (error) => {
                            reject(error);
                        }
                    );
            }
        );
        
    }*/

    //VERSION NODE
    /*connectUser(pseudo: String, password: String) {
        const compte = {
            pseudo: pseudo,
            password: password
        };
        return new Promise(
            (resolve, reject) => {
                this.httpClient
                    .post('http://localhost:8080/api/logUser', compte)
                    .subscribe(
                        (response) => {
                            resolve(response);
                            if(response === "ok"){
                                this.isAuth = true;
                            }else{
                                this.isAuth = false;
                            }
                            this.emitIsAuth();
                        },
                        (error) => {
                            reject(error);
                        }
                    );
            }
        );
        
    }*/

    /*addUser(pseudo: String, email: String, password: String) {
        const compte = {
            pseudo: pseudo,
            email: email,
            password: password
        };
        return new Promise(
            (resolve, reject) => {
                this.httpClient
                    .post('http://localhost:8878/mini-jeu/php/register.php', compte)
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
            }
        );
    }*/
    /*
    addUser(pseudo: String, email: String, password: String) {
        const compte = {
            pseudo: pseudo,
            email: email,
            password: password
        };
        return new Promise(
            (resolve, reject) => {
                this.httpClient
                    .post('http://localhost:8080/api/addUser', compte)
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
            }
        );
    }
*/