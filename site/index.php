<?php
// gestion des routes
  $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  if ('/index.php' == $uri)
    {
      require 'view/accueil.php';
    }
    elseif ('/index.php/interventions' == $uri)
    {
      require 'controllers/interventions.php';
    }
  elseif ('/index.php/intervention' == $uri && isset($_GET['id']))
    {
        require 'controllers/intervention.php';
    }
    else
    {
        header('Status: 404 Not Found');
        echo '<html><body><h1>Page Not Found</h1></body></html>';
    }
  ?>