<?php
function get_intervention_by_id($id){
  include_once 'db_config.php';
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
    $result = $stmt->fetch();
    

    // fermer la connexion
  $conn = null;
  return $result;
}