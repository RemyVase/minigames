<?php

include 'dbAccess.php';

$db = new dbAccess();

$json = file_get_contents('php://input');
$obj = json_decode($json,true);

$pseudo = htmlspecialchars($obj["pseudo"]);
$password = hash("sha256",htmlspecialchars($obj["password"]));

$checkCompteValide = $db->callProcedure("checkCompteValide", [$pseudo, $password]);

if(!empty($obj)){
    if (!empty($checkCompteValide)) {
        echo json_encode('ok');
    } else {
        echo json_encode("pasOk");
    }
}