<?php

require_once __DIR__ . '/../vendor/autoload.php';

use \UASmartHome\Auth\Firewall;
Firewall::instance()->restrictAccess(Firewall::ROLE_RESIDENT, Firewall::ROLE_MANAGER);

/* Setup Twig environment. */
$twig = \UASmartHome\TwigSingleton::getInstance();

/* Initialize all of these! */
$view = new \UASmartHome\View();

$scores = $view->getScores();

echo $twig->render('resident/scoreboard.html',
    array('scores' => $scores));
