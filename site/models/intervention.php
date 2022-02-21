<?php
function get_intervention_by_id($id){
    // se connecter
    $conn=getConnexion();
    
    // préparer la requête et l'exécuter
    $sql = "SELECT id, date_heure, etat, matricule, id_client
	FROM intervention
	WHERE id=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
  
    // demander un retour sous forme de tableau associatif
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    

    // fermer la connexion
  $conn = null;
  return $result;
}