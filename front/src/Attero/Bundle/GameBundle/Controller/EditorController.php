<?php

namespace Attero\Bundle\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class EditorController extends Controller
{
    /**
     * @Route("/editor")
     * @Template()
     */
    public function editorAction()
    {
        return array();
    }
}
