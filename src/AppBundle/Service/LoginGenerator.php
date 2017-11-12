<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

class LoginGenerator
{
    private $entityManager;

    public function __construct(EntityManager $em)
    {
        $this->entityManager = $em;
    }
    public function createLoginOld()
    {
        $result='';
        srand((double)microtime() * 1000000);
        for ($x = 0; $x < 100; $x++)
        {
            $length = rand(6,10);
            $conso=array('b','c','d','f','g','h','j','k','l','m','n','p','r','s','t','v','w','x','y','z');
            $vocal=array('a','e','i','o','u');
            $result='';
            for ($i = 0; $i < $length; $i++)
            {
                if (($i % 2) == 0) $result .= $conso[rand(0,19)];
                else $result .= $vocal[rand(0,4)];
            }
            $result .= rand(10,99);
            $user = $this->entityManager->getRepository("AppBundle:User")->findOneByUsername($result);
            if ($user == null) return $result;
        }
        return $result;
    }
    public function createLogin()
    {
        $result='';
        for ($x = 0; $x < 1000; $x++)
        {
            srand((double)microtime() * 1000000);
            $result = "PN";
            for ($i = 0; $i < 7; $i++)
                $result .= rand(0,9);
            $user = $this->entityManager->getRepository("AppBundle:User")->findOneByUsername($result);
            if ($user == null) return $result;
        }
        return $result;
    }
}
