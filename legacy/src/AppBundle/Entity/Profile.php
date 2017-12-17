<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="profiles")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProfileRepository")
 */
class Profile
{
    const GENDER_UNKNOWN = 1;
    const GENDER_FEMALE = 2;
    const GENDER_MALE = 3;

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /** @ORM\OneToOne(targetEntity="User", mappedBy="profile") */
    private $owner;

    /** @ORM\Column(type="integer") */
    private $gender = Profile::GENDER_UNKNOWN;

    /** @ORM\Column(type="datetime") */
    private $birthday = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $activeSymptoms = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $pastSymptoms = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $possibleDiagnosis = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $activeDiagnosis = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $pastDiagnosis = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $activeMedicaments = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $pastMedicaments = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $hospitals = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $doctors = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $procedures = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $alternativeMedicine = null;
    
    /** @ORM\Column(type="string", nullable=true) */
    private $supplement = null;

    public function __construct()
    {
        $this->birthday = new \DateTime('now');
    }
    public function getId()
    {
        return $this->id;
    }
    public function getGender()
    {
        return $this->gender;
    }
    public function setGender($value)
    {
        $this->gender = $value;
        return $this;
    }
    public function getBirthday()
    {
        return $this->birthday;
    }
    public function setBirthday(\DateTime $date)
    {
        $this->birthday = $date;
        return $this;
    }
    public function getAge()
    {
        return (new \DateTime("now"))->diff($this->birthday)->format("%y");
    }

    public function setActiveSymptoms($value)
    {
        $this->activeSymptoms = $value;
        return $this;
    }
    public function setPastSymptoms($value)
    {
        $this->pastSymptoms = $value;
        return $this;
    }
    public function setPossibleDiagnosis($value)
    {
        $this->possibleDiagnosis = $value;
        return $this;
    }
    public function setActiveDiagnosis($value)
    {
        $this->activeDiagnosis = $value;
        return $this;
    }
    public function setPastDiagnosis($value)
    {
        $this->pastDiagnosis = $value;
        return $this;
    }
    public function setActiveMedicaments($value)
    {
        $this->activeMedicaments = $value;
        return $this;
    }
    public function setPastMedicaments($value)
    {
        $this->pastMedicaments = $value;
        return $this;
    }
    public function setHospitals($value)
    {
        $this->hospitals = $value;
        return $this;
    }
    public function setDoctors($value)
    {
        $this->doctors = $value;
        return $this;
    }
    public function setProcedures($value)
    {
        $this->procedures = $value;
        return $this;
    }
    public function setAlternativeMedicine($value)
    {
        $this->alternativeMedicine = $value;
        return $this;
    }
    public function setSupplement($value)
    {
        $this->supplement = $value;
        return $this;
    }
    public function getActiveSymptoms() { return $this->activeSymptoms; }
    public function getPastSymptoms() { return $this->pastSymptoms; }
    public function getPossibleDiagnosis() { return $this->possibleDiagnosis; }
    public function getActiveDiagnosis() { return $this->activeDiagnosis; }
    public function getPastDiagnosis() { return $this->pastDiagnosis; }
    public function getActiveMedicaments() { return $this->activeMedicaments; }
    public function getPastMedicaments() { return $this->pastMedicaments; }
    public function getHospitals() { return $this->hospitals; }
    public function getDoctors() { return $this->doctors; }
    public function getProcedures() { return $this->procedures; }
    public function getAlternativeMedicine() { return $this->alternativeMedicine; }
    public function getSupplement() { return $this->supplement; }
}

