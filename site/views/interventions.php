<?php
  $title = 'Liste des interventions';
  ob_start();
?>
  <h1>Liste des interventions</h1>
  <ul>
  <?php foreach ($interventions as $intervention): ?>
  <li>
      <a href="<?=$index?>/intervention?id=<?=$intervention['id']?>">
          <?= 'Intervention '.$intervention['id'].' : '.$intervention['matricule'] ?>
      </a>
  </li>
  <?php endforeach; ?>
  </ul>
<?php
// mettre tout le html écris au-dessus dans la variable $content au lieu de l'afficher
  $content = ob_get_clean();
  require_once 'base_template.php'
?>