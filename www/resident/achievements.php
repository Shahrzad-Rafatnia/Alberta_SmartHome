<?php

require_once __DIR__ . '/../vendor/autoload.php';


/* Setup Twig environment. */
$twig = TwigSingleton::getInstance();

/* Initialize all of these! */
$model = new \UASmartHome\Model();
$controller = new \UASmartHome\Controller();
$view = new \UASmartHome\View($controller, $model);

$achievements = $view->getAchievements();

echo $twig->render('resident/achievements.html',
    array('achievements' => $achievements));

