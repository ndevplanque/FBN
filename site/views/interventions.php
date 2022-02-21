<?php
  $title = 'Liste des interventions';
  ob_start();
?>
  <h1>Liste des interventions</h1>
  <ul>
  <?php foreach ($interventions as $intervention): ?>
  <li>
      <a href="/intervention?id=<?php echo $intervention['id'] ?>">
          <?php echo "Intervention $intervention[id] : $intervention[matricule]" ?>
      </a>
  </li>
  <?php endforeach; ?>
  </ul>
<?php
// mettre tout le html écris au-dessus dans la variable $content au lieu de l'afficher
  $content = ob_get_clean();
  include 'base.php'
?>