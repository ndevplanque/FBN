<?php
  require_once '../models/interventions.php';
  $interventions = get_all_interventions();
  require '../views/interventions.php';