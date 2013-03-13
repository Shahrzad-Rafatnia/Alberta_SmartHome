<?php

require_once __DIR__ . '/../vendor/autoload.php';

/* Setup Twig environment. */
$twig = \UASmartHome\TwigSingleton::getInstance();

/* Initialize all of these! */
$view = new \UASmartHome\View();

$scores = $view->getScores();

echo $twig->render('resident/scoreboard.html',
    array('scores' => $scores));
