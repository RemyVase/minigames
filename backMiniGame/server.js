const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');


const usersConnected = [];

const partyTicTac = [];


//Option pour ne pas se faire bloquer par CORS
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

//Connection à la Base de données
function dbConnect() {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '8889',
        user: 'root',
        password: 'root',
        database: 'minigame'
    });

    connection.connect();

    return connection;
}

//Activer protection CORS 
app.use(cors(corsOptions));

server.listen(8080, () => {
    console.log(`Serveur running on port ${server.address().port}`);
});

require('socketio-auth')(io, {
    authenticate: authenticate,
    postAuthenticate: postAuthenticate,
    disconnect: disconnect,
    timeout: 'none'
});

io.on('connection', socket => {
    console.log(`Someone open socket from ${socket.handshake.address}`);

    socket.on('register', (data) => {
        var db = dbConnect();
        var pseudo = data.username;
        var email = data.email;
        var password = data.password;

        var checkMail = db.query("call checkEmail(?)", [email], function (err, result) {

            if (result[0][0] === undefined) {
                var checkPseudo = db.query("call checkPseudo(?)", [pseudo], function (err, result) {
                    if (result[0][0] === undefined) {
                        let crypto = require('crypto');
                        let passwordCrypt = crypto.createHmac('sha256', password)
                            .update('5642ezgreh7786')
                            .digest('hex');
                        db.query("call register(?,?,?)", [pseudo, email, passwordCrypt], function (err, result) {
                            socket.emit('registered', { ok: "ok" });
                        });
                    }
                    else {
                        socket.emit('registered', { ok: "pasOk" });
                    }
                });
            }
            else {
                socket.emit('registered', { ok: "pasOk" });
            }
        });
    });

    socket.on('getIdPartyOfUser', (data) => {
        var db = dbConnect();
        let checkNomValide = db.query("call getPartyIdOfUser(?)", [data.idCrea], function (err, result) {
            console.log('GET ID PARTY OF USER');
            if(result[0][0] != undefined){
                socket.emit('returnIdPartyUser', { idParty : Object.values(JSON.parse(JSON.stringify(result[0][0])))});
            }
        });
    });

    socket.on('addPartyTicTac', (data) => {
        var db = dbConnect();
        var nom = data.name;
        var password = data.password;
        var passwordAsk = data.passwordAsk;
        var idUser = data.idCrea;

        //On check si le nom de la partie tictac est déjà dans la db
        let checkNomValide = db.query("call checkNomPartyTictac(?)", [nom], function (err, result) {
            if (result[0][0] === undefined) {
                //On ajoute la partie tictac dans la db
                let addParty = db.query("call addTicTac(?,?,?)", [nom, password, passwordAsk], function (err, result) {
                    //console.log('Partie de tic tac toe ajoutée à la db');
                    let getIdParty = db.query("call checkNomPartyTictac(?)", [nom], function (err, result) {
                        socket.join('tictac' + result[0][0].id, function() {
                            console.log("Quelqu'un a rejoind la room")
                            //socket.in('tictac' + result[0][0].id).emit('tictacAdded', Object.values(JSON.parse(JSON.stringify(result[0]))));
                            socket.emit('tictacAdded', Object.values(JSON.parse(JSON.stringify(result[0]))));
                        });
                        
                        let idParty = Object.values(JSON.parse(JSON.stringify(result[0][0])));
                        let addPartyWithUser = db.query("call liaisonCreaTictac(?,?)", [idUser, result[0][0].id], function (err, result) {
                            let allTicTac = db.query("call getAllTicTacParty()", function (err, result) {
                                let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
                                socket.emit('allTicTacParty', ret);
                                socket.broadcast.emit('allTicTacParty', ret);

                            });
                        });
                    });
                });
            } else {
                //Retourne une erreur si le nom de la partie tictac est déjà dans la bdd
                socket.emit('tictacAdded', [{ id: -1 }]);
            }
        });
    });

    socket.on('decoUser', (data) => {
        var indexOfUser = usersConnected.findIndex(i => i.pseudo === data.pseudo);
        usersConnected.splice(indexOfUser, 1);
        socket.broadcast.emit('allUsersConnected', { usersConnected });
        socket.emit('allUsersConnected', { usersConnected });
    });

    socket.on('getAllTicTacParty', () => {
        var db = dbConnect();
        var allTicTac = db.query("call getAllTicTacParty()", function (err, result) {
            let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
            socket.emit('allTicTacParty', ret);
        });
    });

    socket.on('checkIfCreatorTicTac', (data) => {
        var db = dbConnect();
        var checkSiCrea = db.query("call checkCreaTicTac(?)", [data.idUser], function (err, result) {
            if(result != undefined){
                if (result[0][0] === undefined) {
                    var removeJoueurDeLaPartie = db.query("call removePlayerFromPartyTicTac(?)", [data.idParty], function (err, result) {
                        var modifNbPlaces = db.query('call downgradePlacesTicTac(?)', [data.idParty], function (err, result) {
                            let allTicTac = db.query("call getAllTicTacParty()", function (err, result) {
                                let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
                                socket.emit('allTicTacParty', ret);
                                socket.broadcast.emit('allTicTacParty', ret);
                                let allTicTac = db.query("call getPseudoUser(?)", [data.idUser], function (err, result) {
                                    console.log('CheckIfCreator testttt');
                                    socket.to('tictac' + data.idParty).emit('playerHasLeftPartyTicTac', { pseudo : result[0][0] });
                                    socket.in('tictac' + data.idParty).emit('playerLeaveRoom', {data: 'Un joueur a quitté la partie'});
                                    socket.leave('tictac' + data.idParty, function() {
                                        console.log("Quelqu'un a quitté la room")
                                    });
                                });
                            });
                        });
                    });
                } else {
                    var deleteParty = db.query("call removeTicTac(?)", [data.idParty], function (err, result) {
                        let allTicTac = db.query("call getAllTicTacParty()", function (err, result) {
                            let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
                            socket.emit('allTicTacParty', ret);
                            socket.broadcast.emit('allTicTacParty', ret);
                            socket.in('tictac' + data.idParty).emit('playerHasLeftPartyTicTac', { pseudo : result[0][0] });
                            socket.in('tictac' + data.idParty).emit('playerLeaveRoom', {leave: "ok" ,data: 'Le créateur de la partie à quitter la partie et celle-ci a été détruite'});
                            socket.leave('tictac' + data.idParty, function() {
                                console.log("Quelqu'un a quitté la room")
                            });
                        });
                    });
                }
            }
            
        });
    });


    socket.on('playerEnterTicTac', (data) => {
        var db = dbConnect();
        var idUser = data.idUser;
        var idParty = data.idParty;

        var checkSiJoueurPasEncoreDansUnePartie = db.query("call checkUserPartyTicTac(?)", [idUser], function (err, result) {
            if (result[0][0] === undefined) {
                console.log("Le joueur n'est pas encore dans une partie.");
                var addJoueurALaPartie = db.query("call addPlayerToTicTacParty(?,?)", [idUser, idParty], function (err, result) {
                    var modifNbPlaces = db.query('call upgradePlacesTicTac(?)', [idParty], function (err, result) {
                        let allTicTac = db.query("call getAllTicTacParty()", function (err, result) {
                            let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
                            socket.join('tictac' + idParty, function() {
                                console.log("Quelqu'un a rejoind la room")
                            });
                            socket.emit('allTicTacParty', ret);
                            socket.broadcast.emit('allTicTacParty', ret);
                            socket.in('tictac' + idParty).emit('playerEnterInRoom', {data: 'Un joueur a rejoind la partie'});
                        });

                    });
                });
            }
        });
    });

    socket.on('changePassword', (data) => {
        var db = dbConnect();
        var pseudo = data.pseudo;
        var oldPassword = data.oldPassword;
        var newPassword = data.newPassword;

        let crypto = require('crypto');
        let oldPasswordCrypt = crypto.createHmac('sha256', oldPassword)
            .update('5642ezgreh7786')
            .digest('hex');

        let newPasswordCrypt = crypto.createHmac('sha256', newPassword)
            .update('5642ezgreh7786')
            .digest('hex');

        var checkIfGoodOldPassword = db.query("call checkOldPassword(?,?)", [pseudo, oldPasswordCrypt], function (err, result) {
            if (result[0][0] !== undefined) {
                var changePassword = db.query("call changePassword(?,?)", [pseudo, newPasswordCrypt], function (err, result) {
                    socket.emit('changingPassword', { data: "ok" });
                });
            }
            else {
                console.log('ancien mot de passe pas bon !');
                socket.emit('changingPassword', { data: "pas ok" });
            }
        });
    });

    socket.on('playerEnterTicTacPassword', (data) => {
        var db = dbConnect();
        var idUser = data.idUser;
        var idParty = data.idParty;
        var password = data.passwordEnter;

        var checkSiJoueurPasEncoreDansUnePartie = db.query("call checkUserPartyTicTac(?)", [idUser], function (err, result) {
            if (result[0][0] === undefined) {
                //console.log("Le joueur n'est pas encore dans une partie.");
                var checkPasswordTicTac = db.query("call checkPasswordTicTac(?,?)", [idParty, password], function (err, result) {
                    console.log(result[0][0]);
                    if (result[0][0] != undefined) {
                        var addJoueurALaPartie = db.query("call addPlayerToTicTacParty(?,?)", [idUser, idParty], function (err, result) {
                            socket.join('tictac' + idParty, function() {
                                console.log("Quelqu'un a rejoind la room")
                            });
                            socket.in('tictac' + idParty).emit('playerEnterInRoom', {data: 'Un joueur a rejoind la partie'});
                            var modifNbPlaces = db.query('call upgradePlacesTicTac(?)', [idParty], function (err, result) {
                                let allTicTac = db.query("call getAllTicTacParty()", function (err, result) {
                                    let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
                                    socket.emit('tictacPassword', { data: "ok" });
                                    socket.emit('allTicTacParty', ret);
                                    socket.broadcast.emit('allTicTacParty', ret);
                                });
                            });
                        });
                    }
                    else {
                        socket.emit('tictacPassword', { data: "pas ok" });
                    }
                });
            }
        });
    });


    socket.on('needAllInfoRoomTicTac', (data) => {
        var db = dbConnect();
        var idParty = data.idParty;

        var checkSiJoueurPasEncoreDansUnePartie = db.query("call getInfosRoomTicTac(?)", [idParty], function (err, result) {
            let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
            socket.emit('returnAllInfoRoomTicTac', ret );
            socket.in('tictac'+idParty).emit('returnAllInfoRoomTicTac', ret );
        });
    });

    socket.on('tictacPlayer',(data) =>{
        if(data.role === "X"){
            socket.in('tictac' + data.idParty).emit('newTicTacPlayer', { role: "O"});
            socket.emit('newTicTacPlayer', { role: "O"});
            socket.in('tictac' + data.idParty).emit('currentParty', { currentParty: data.currentParty});
            socket.emit('currentParty', { currentParty: data.currentParty });
        }else{
            socket.in('tictac' + data.idParty).emit('newTicTacPlayer', { role: "X"});
            socket.emit('newTicTacPlayer', { role: "X"});
            socket.in('tictac' + data.idParty).emit('currentParty', { currentParty: data.currentParty});
            socket.emit('currentParty', { currentParty: data.currentParty });
        }
    });

    socket.on('playerTicTacReady', (data) => {
        if(data.idPlayer === 1){
            socket.in('tictac' + data.idParty).emit('playerTicTacReadyStatus', { player1: true });
            socket.emit('playerTicTacReadyStatus', { player1: true });
        }
        if(data.idPlayer === 2){
            socket.in('tictac' + data.idParty).emit('playerTicTacReadyStatus', { player2: true });
            socket.emit('playerTicTacReadyStatus', { player2: true });
        }
    });

    socket.on('playerTicTacNotReady', (data) => {
        if(data.idPlayer === 1){
            socket.in('tictac' + data.idParty).emit('playerTicTacReadyStatus', { player1: false });
            socket.emit('playerTicTacReadyStatus', { player1: false });
        }
        if(data.idPlayer === 2){
            socket.in('tictac' + data.idParty).emit('playerTicTacReadyStatus', { player2: false });
            socket.emit('playerTicTacReadyStatus', { player2: false });
        }
    });

    socket.on('addPointTicTac', (data) => {
        var db = dbConnect();
        var pseudoPlayer = data.pseudoPlayer;
        var idParty = data.idParty;

        var addPointTicTac = db.query("call addPointTicTac(?)", [pseudoPlayer], function (err, result) {
            var checkSiJoueurPasEncoreDansUnePartie = db.query("call getInfosRoomTicTac(?)", [idParty], function (err, result) {
                if(result != undefined){
                    let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
                    socket.emit('returnAllInfoRoomTicTac', ret );
                    socket.broadcast.emit('returnAllInfoRoomTicTac', ret );
                }

            });
        });
    });

    socket.on('substractPointTicTac', (data) => {
        var db = dbConnect();
        var pseudoPlayer = data.pseudoPlayer;
        var idParty = data.idParty;

        var addPointTicTac = db.query("call substractPointTicTac(?)", [pseudoPlayer], function (err, result) {
            var checkSiJoueurPasEncoreDansUnePartie = db.query("call getInfosRoomTicTac(?)", [idParty], function (err, result) {
                let ret = Object.values(JSON.parse(JSON.stringify(result[0])));
                socket.emit('returnAllInfoRoomTicTac', ret );
                socket.broadcast.emit('returnAllInfoRoomTicTac', ret );
            });
        });
    });
});

function authenticate(socket, data, callback) {
    var login = data.username;
    var password = data.password;
    var db = dbConnect();

    var indexOfUser = usersConnected.findIndex(i => i.pseudo === login);
    console.log(indexOfUser);
    if (indexOfUser === -1) {
        usersConnected.push({ pseudo: login });
    }

    let crypto = require('crypto');
    let passwordCrypt = crypto.createHmac('sha256', password)
        .update('5642ezgreh7786')
        .digest('hex');
    var checkValide = db.query("call checkCompteValide(?,?)", [login, passwordCrypt], function (err, result) {
        socket.emit('getIdUser', Object.values(JSON.parse(JSON.stringify(result[0]))));
        return callback(null, result[0][0] != undefined);
    });

    socket.broadcast.emit('allUsersConnected', { usersConnected });
    socket.emit('allUsersConnected', { usersConnected });

}

function postAuthenticate(socket, data) {
    console.log("POST AUTHENTICATE");
}

function disconnect(socket) {
    console.log("disconnect");
}

