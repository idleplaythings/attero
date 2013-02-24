<?php

namespace Attero\Bundle\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class GameController extends Controller
{
    /**
     * @Route("/game/{gameId}/{playerId}/{mapString}")
     * @Template()
     */
    public function gameAction($gameId, $playerId, $mapString)
    {
        return array(
            'gameId' => $gameId,
            'playerId' => $playerId,
            'mapString' => $mapString,
            'units' => ''
        );
    }
}

