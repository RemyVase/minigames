<?php

include 'dbAccess.php';

$db = new dbAccess();

$json = file_get_contents('php://input');
$obj = json_decode($json,true);

$pseudo = htmlspecialchars($obj["pseudo"]);
$email = htmlspecialchars($obj["email"]);
$password = hash("sha256",htmlspecialchars($obj["password"]));

$checkEmail = $db->callProcedure("checkMail", [$email]);
$checkPseudo = $db->callProcedure("checkPseudo", [$pseudo]);

if(!empty($obj)){
    if (!empty($checkEmail)) {
        if (!empty($checkPseudo)) {
            echo json_encode("mailPseudoPasOk");
        } else {
            echo json_encode("mailPasOk");
        }
    } else if (!empty($checkPseudo)) {
        echo json_encode("pseudoPasOk");
    } else {
        $inscription = $db->callProcedure('register', [$pseudo, $email, $password]);
        echo json_encode("ok");
    }
}
