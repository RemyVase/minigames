<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

class dbAccess
{

    private $pdo = null;

    public function connexionDB()
    {
        try {
            $this->pdo = new PDO("mysql:host=localhost:8889;dbname=minigame;charset=utf8", "root", "root");
        } catch (Exception $e) {
            die("Erreur :" . $e->getMessage());
        }
    }

    public function callProcedure($nomProcedure, $procParams = array())
    {
        $params = array();
        switch ($nomProcedure) {
            case 'checkMail':
            case 'checkPseudo':
                array_push($params, '?');

                try {
                    $this->connexionDB();
                    $procedureCall = 'call ' . $nomProcedure . '(' . join(',', $params) . ')';
                    $requete = $this->pdo->prepare($procedureCall);
                    $requete->execute($procParams);
                    return $requete->fetchAll();
                } catch (Exception $e) {
                    die("Erreur :" . $e->getMessage());
                }
                break;
        }
        switch ($nomProcedure) {
            case 'checkCompteValide':
                array_push($params, '?', '?');

                try {
                    $this->connexionDB();
                    $procedureCall = 'call ' . $nomProcedure . '(' . join(',', $params) . ')';
                    $requete = $this->pdo->prepare($procedureCall);
                    $requete->execute($procParams);
                    return $requete->fetchAll();
                } catch (Exception $e) {
                    die("Erreur :" . $e->getMessage());
                }
                break;
        }
        switch ($nomProcedure) {
            case 'register':
                array_push($params, '?', '?', '?');

                try {
                    $this->connexionDB();
                    $procedureCall = 'call ' . $nomProcedure . '(' . join(',', $params) . ')';
                    $requete = $this->pdo->prepare($procedureCall);
                    $requete->execute($procParams);
                    return $requete->fetchAll();
                } catch (Exception $e) {
                    die("Erreur :" . $e->getMessage());
                }
                break;
        }
    }
}
