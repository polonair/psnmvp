<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Table(name="users")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 */
class User implements UserInterface, \Serializable
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /** @ORM\Column(type="string", length=25, unique=true) */
    private $username;

    /** @ORM\OneToOne(targetEntity="Profile", inversedBy="owner", cascade={"persist"}) */
    private $profile;

    /**
     * @Assert\NotBlank()
     * @Assert\Length(max=4096)
     */
    private $plainPassword;

    /** @ORM\Column(type="string", length=64) */
    private $password;

    /** @ORM\Column(name="is_active", type="boolean") */
    private $isActive;

    /** @ORM\Column(type="integer") */
    private $cqType;

    /** @ORM\Column(type="string", length=64) */
    private $cqValue;

    public function __construct()
    {
        $this->isActive = true;
        $this->profile = new Profile();
    }
    public function setCqType($value)
    {
        $this->cqType = $value;
        return $this;
    }
    public function getCqType()
    {
        return $this->cqType;
    }
    public function getUsername()
    {
        return $this->username;
    }
    public function setCqValue($value)
    {
        $this->cqValue = $value;
        return $this;
    }
    public function getCqValue()
    {
        return $this->cqValue;
    }
    public function setUsername($username)
    {
        $this->username = $username;
        return $this;
    }
    public function getSalt()
    {
        return null;
    }
    public function getRoles()
    {
        return array('ROLE_USER');
    }
    public function eraseCredentials()
    {
    }
    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
        ));
    }
    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->username,
            $this->password,
        ) = unserialize($serialized);
    }
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }
    public function setPlainPassword($password)
    {
        $this->plainPassword = $password;
    }
    public function getPassword()
    {
        return $this->password;
    }
    public function setPassword($password)
    {
        $this->password = $password;
    }
    public function getProfile()
    {
        return $this->profile;
    }
}
