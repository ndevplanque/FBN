<?php
  $title = $intervention['id'];
  ob_start();
?>
  <h1>Intervention <?=$intervention['id']?></h1>
  <p>Client : <?=$intervention['client']?></p>
  <p>Planifiée le : <?=$intervention['date_heure']?></p>
  <p>Etat : <?=$intervention['etat']?></p>
  <p>Affectée à : <?=$intervention['prenom'].' '.$intervention['nom']?></p>

<?php
// mettre tout le html écris au-dessus dans la variable $content au lieu de l'afficher
  $content = ob_get_clean();
  require_once 'base_template.php'
?>