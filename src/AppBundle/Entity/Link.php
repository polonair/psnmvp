<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="links")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\LinkRepository")
 */
class Link
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity="Profile")
     */
    private $profile;

    /**
     * @ORM\Column(type="datetime")
     */
    private $worksTill;

    public function __construct()
    {
    	$this->name = md5(uniqid(rand(), true));
    }
    public function getName()
    {
    	return $this->name;
    }
    public function setProfile(Profile $profile)
    {
    	$this->profile = $profile;
        return $this;
    }
    public function getProfile()
    {
        return $this->profile;
    }
    public function setWorksTill(\DateTime $value)
    {
        $this->worksTill = $value;
        return $this;
    }
    public function getWorksTill()
    {
        return $this->worksTill;
    }
}

