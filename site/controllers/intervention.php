<?php
  require_once 'models/intervention.php';
  $intervention = get_intervention_by_id($_GET['id']);
  require_once 'views/intervention.php';