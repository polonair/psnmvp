<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use AppBundle\Form\UserType;
use AppBundle\Entity\User;
use AppBundle\Service\LoginGenerator;

use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class DefaultController extends Controller
{
    /** @Route("/", name="index") */ 
    public function indexAction(Request $request) { return $this->redirectToRoute('profile'); }

    /** @Route("/auth/register", name="register") */ 
    public function registerAction(Request $request, UserPasswordEncoderInterface $passwordEncoder, LoginGenerator $generator)
    {
        $user = new User();
        $user->setUsername($generator->createLogin())->setCqType(1);
        $form = $this->createForm(UserType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) 
        {
            $password = $passwordEncoder->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);            
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            $token = new UsernamePasswordToken($user, null, "main", $user->getRoles());
            $this->get("security.token_storage")->setToken($token);
            $event = new InteractiveLoginEvent($request, $token);
            $this->get("event_dispatcher")->dispatch("security.interactive_login", $event);
            $this->addFlash('plainPassword', $user->getPlainPassword());
            return $this->redirectToRoute('createProfile');
        }
        return $this->render('default/register.html.twig', array('form' => $form->createView()));
    }

    /** @Route("/auth/login", name="login") */ 
    public function loginAction(Request $request, AuthenticationUtils $authUtils)
    {
        $error = $authUtils->getLastAuthenticationError();
        $lastUsername = $authUtils->getLastUsername();

        return $this->render('default/login.html.twig', array(
            'last_username' => $lastUsername, 
            'error' => $error
        ));
    }

    /** @Route("/auth/recover", name="recover") */ 
    public function recoverAction(Request $request, UserPasswordEncoderInterface $passwordEncoder)
    {
        $u = new User();
        $form = $this->createForm(UserType::class, $u);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid())
        {
            $password = $passwordEncoder->encodePassword($u, $u->getPlainPassword());
            $u->setPassword($password);
            $em = $this->getDoctrine()->getManager();
            $user = $em->getRepository("AppBundle:User")->findOneByUsername($u->getUsername());
            $user->setPassword($password);
            $em->flush();
            $token = new UsernamePasswordToken($user, null, "main", $user->getRoles());
            $this->get("security.token_storage")->setToken($token);
            $event = new InteractiveLoginEvent($request, $token);
            $this->get("event_dispatcher")->dispatch("security.interactive_login", $event);
            $this->addFlash('plainPassword', $user->getPlainPassword());
            return $this->redirectToRoute('profile');
        }
        return $this->render('default/recover.html.twig', array('form' => $form->createView()));
    }

    /** @Route("/my/profile", name="profile") */ 
    public function profileAction(Request $request)
    {
        return $this->render('default/profile.view.html.twig');
    }

    /** @Route("/my/profile/create", name="createProfile") */ 
    public function createProfileAction(Request $request)
    {
        $flashbag = $this->get('session')->getFlashBag();
        $password = $flashbag->get("plainPassword", [ null ]);
        return $this->render('default/profile.create.html.twig', [ "plainPassword" => $password[0] ]);
    }
    
    /** @Route("/link/{code}", name="viewLink") */ 
    public function viewLinkAction(Request $request)
    {
        $code = $request->attributes->get("code");
        $link = $this->getDoctrine()->getRepository("AppBundle:Link")->findOneByName($code);
        if ($link && ($link->getWorksTill() > (new \DateTime("now")))) return $this->render('default/link.view.html.twig', [ 'link' => $link, ]);
        else return $this->render('default/link.404.html.twig', [], new Response("", 404));
    }
}
