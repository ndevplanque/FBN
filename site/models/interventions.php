<?php

function get_all_interventions(){
    // se connecter
    $conn=getConnexion();
    
    // préparer la requête et l'exécuter
    $sql = "SELECT id, date_heure, etat, matricule, id_client
	FROM intervention";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
  
    // demander un retour sous forme de tableau associatif
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    

    // fermer la connexion
  $conn = null;
  return $result;
}
