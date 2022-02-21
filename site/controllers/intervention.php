<?php
  require_once '../models/intervention.php';
  $interventions = get_intervention_by_id($_GET['id']);
  require '../views/intervention.php';