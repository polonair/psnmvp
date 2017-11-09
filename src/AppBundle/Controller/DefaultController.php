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
        // 1) build the form
        $user = new User();
        $user
            ->setUsername($generator->createLogin())
            ->setCqType(1);
        $form = $this->createForm(UserType::class, $user);

        // 2) handle the submit (will only happen on POST)
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            // 3) Encode the password (you could also do this via Doctrine listener)
            $password = $passwordEncoder->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);

            // 4) save the User!
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
            'error'         => $error,
        ));
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
    
    /*
     * @Route("/my/profile/edit", name="editProfile")
     */ 
    /*public function editProfileAction(Request $request)
    {
        return $this->render('default/profile.edit.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }
    /*
     * @Route("/my/link/create", name="createLink")
     */ 
    /*public function createLinkAction(Request $request)
    {
        return $this->render('default/link.create.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }*/
}