<?php
function getConnexion(){
$SERVEUR='localhost';
$UTILISATEUR = 'admin';
$MOT_DE_PASSE = 'admin';

try {
  $conn = new PDO("mysql:host=$SERVEUR;dbname=cashcash", $UTILISATEUR, $MOT_DE_PASSE);
  // autoriser PDO à transmettre les erreurs émises par la BDD
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  echo "Connexion réussie";
  return $conn;
} catch(PDOException $e) {
  echo "Eched de la connexion : " . $e->getMessage();
}


}