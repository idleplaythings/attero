<?php

namespace Attero\Bundle\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class GameController extends Controller
{
    /**
     * @Route("/game")
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/game/{gameId}/{playerId}")
     * @Template()
     */
    public function gameAction($gameId, $playerId)
    {
        return array('gameId' => $gameId, 'playerId' => $playerId);
    }
}

