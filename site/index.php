<?php
// gestion des routes
  $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $index='/FBN/site/index.php';
  if ($index == $uri)
    {
      require_once 'views/accueil.php';
    }
    elseif ($index.'/interventions' == $uri)
    {
      require_once 'controllers/interventions.php';
    }
  elseif ($index.'/intervention' == $uri && isset($_GET['id']))
    {
        require_once 'controllers/intervention.php';
    }
    else
    {
        header('Status: 404 Not Found');
        echo '<!DOCTYPE html><html><body><h1>'.$uri.' : page Not Found</h1></body></html>';
    }