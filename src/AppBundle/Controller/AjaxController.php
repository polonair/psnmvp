<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use AppBundle\Form\UserType;
use AppBundle\Entity\User;
use AppBundle\Entity\Link;
use AppBundle\Entity\Profile;
use AppBundle\Service\LoginGenerator;
use AppBundle\Utils\QuestionCollection;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class AjaxController extends Controller
{ 
    /** @Route("/_ajax/checkcredentials", name="checkcredentials") */ 
    public function checkCredentialsAction(Request $request) 
    { 
        $username = $request->query->get("username", "empty");
        $cqtype = $request->query->get("cqtype", "empty");
        $cqvalue = $request->query->get("cqvalue", "empty");

        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository("AppBundle:User")->findOneByUsername($username);
        if ($user && ($user->getCqType() == $cqtype) && ($user->getCqValue() == $cqvalue))
            return new JsonResponse(array('result' => 'ok'));
        else
            return new JsonResponse(array('result' => 'fail'));
    }

    /** @Route("/_ajax/findquestion", name="findquestion") */ 
    public function findQuestionAction(Request $request) 
    { 
        $username = $request->query->get("d", "empty");
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository("AppBundle:User")->findOneByUsername($username);
        if ($user) $x = $user->getCqType();
        else $x = rand(0, count(QuestionCollection::QUESTIONS));
        return new JsonResponse(array(
            'cqValue' => $x,
            'cqText' => QuestionCollection::QUESTIONS[$x]
        ));
    }

    /** @Route("/_ajax/nextlogin", name="nextlogin") */ 
    public function nextLoginAction(Request $request, LoginGenerator $generator) 
    { 
        $user = $this->getUser();
        if ($user == null) return new JsonResponse(array('login' => $generator->createLogin()));
        else return new JsonResponse(array('login' => $user->getUsername()));
    }

    /** @Route("/_ajax/createlink", name="createlink") */ 
    public function createLinkAction(Request $request) 
    { 
        $code = $request->query->get("d", 0);
        $wt = (new \DateTime("now"))->add(new \DateInterval('P100Y'));
        switch($code)
        {
            case 1: $wt = (new \DateTime("now"))->add(new \DateInterval('PT1H')); break;
            case 2: $wt = (new \DateTime("now"))->add(new \DateInterval('P1D')); break;
            case 3: $wt = (new \DateTime("now"))->add(new \DateInterval('P1W')); break;
        }
        $user = $this->getUser();
        if ($user == null) return new JsonResponse(array('link' => 'Please, login.'));
        else
        {
        	$link = new Link();
        	$link->setProfile($user->getProfile())->setWorksTill($wt);
            $em = $this->getDoctrine()->getManager();
            $em->persist($link);
            $em->flush();
        	$url = $this->generateUrl(
        		'viewLink', 
        		[ 'code' => $link->getName() ], 
        		UrlGeneratorInterface::ABSOLUTE_URL);
        	return new JsonResponse(array('link' => $url));
        }
    }

    /** @Route("/_ajax/xed", name="xed") */ 
    public function xedAction(Request $request) 
    { 
        $em = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        $name = $request->request->get("name", null);
        $value = $request->request->get("value", null);
        $pk = $request->request->get("pk", null);
        if ($user->getProfile()->getId() == $pk)
        {
            $profile = $em->getRepository(Profile::class)->find($pk);
            if($profile)
            {
                switch($name)
                {
                    case "gender": $profile->setGender($value); break;
                    case "birthday": $profile->setBirthday(\DateTime::createFromFormat("Y-m-d", $value)); break;
                    case "activeSymptoms": $profile->setActiveSymptoms($value); break;
                    case "pastSymptoms": $profile->setPastSymptoms($value); break;
                    case "possibleDiagnosis": $profile->setPossibleDiagnosis($value); break;
                    case "activeDiagnosis": $profile->setActiveDiagnosis($value); break;
                    case "pastDiagnosis": $profile->setPastDiagnosis($value); break;
                    case "activeMedicaments": $profile->setActiveMedicaments($value); break;
                    case "pastMedicaments": $profile->setPastMedicaments($value); break;
                    case "hospitals": $profile->setHospitals($value); break;
                    case "doctors": $profile->setDoctors($value); break;
                    case "procedures": $profile->setProcedures($value); break;
                    case "alternativeMedicine": $profile->setAlternativeMedicine($value); break;
                    case "supplement": $profile->setSupplement($value); break;
                }
                $em->flush();
                return new Response("", 200);
            }
        }
        return new Response("", 400);
    }
}
