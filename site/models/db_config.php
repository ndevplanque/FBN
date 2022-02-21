<?php
function getConnexion(){
$SERVEUR='localhost';
$UTILISATEUR = 'root';
$MOT_DE_PASSE = '';

try {
  $conn = new PDO("mysql:host=$SERVEUR;dbname=cashcash", $UTILISATEUR, $MOT_DE_PASSE);
  // autoriser PDO à transmettre les erreurs émises par la BDD
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $conn;
} catch(PDOException $e) {
  echo "Echec de la connexion : " . $e->getMessage();
}


}