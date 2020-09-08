var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

//Option pour ne pas se faire bloquer par CORS
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

var app = express();

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

//Port d'écoute
app.listen(8080, () => {
    console.log('Server started!');
});

//Récup des envois post vers l'api
app.use(bodyParser.json());


//Gestion ajout user dans la db
app.route('/api/addUser').post((req, res) => {
    var db = dbConnect();
    var data = req.body;

    var checkMail = db.query("call checkEmail(?)", [data.email], function (err, result) {
        if (result[0][0] === undefined) {
            var checkPseudo = db.query("call checkPseudo(?)", [data.pseudo], function (err, result) {
                if (result[0][0] === undefined) {
                    let crypto = require('crypto');
                    let password = crypto.createHmac('sha256', data.password)
                        .update('5642ezgreh7786')
                        .digest('hex');
                    db.query("call register(?,?,?)", [data.pseudo, data.email, password], function (err, result) {
                        res.send(201, '"ok"');
                    });
                }
                else {
                    res.send(201, '"pasOk"');
                }
            });
        }
        else {
            res.send(201, '"pasOk"');
        }
    });
});


//VERSION BASIQUE (COMME PHP)
/*
app.route('/api/logUser').post((req, res) => {
    var db = dbConnect();
    var data = req.body;

    let crypto = require('crypto');
    let password = crypto.createHmac('sha256', data.password)
        .update('5642ezgreh7786')
        .digest('hex');
    var checkValide = db.query("call checkCompteValide(?,?)", [data.pseudo, password], function (err, result) {
        if (result[0][0] != undefined) {
            res.send(201, '"ok"');
        }
        else {
            res.send(201, '"pasOk"');
        }
    });
});*/


