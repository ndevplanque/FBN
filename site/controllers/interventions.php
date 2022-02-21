<?php
  require_once 'models/interventions.php';
  $interventions = get_all_interventions();
  require_once 'views/interventions.php';