<?php

namespace App\Listeners;

use App\Events\Event;
use Aacotroneo\Saml2\Events\Saml2LoginEvent;

Event::listen('Aacotroneo\Saml2\Events\Saml2LoginEvent', function (Saml2LoginEvent $event) {
    $messageId = $event->getSaml2Auth()->getLastMessageId();
    // your own code preventing reuse of a $messageId to stop replay attacks
    $user = $event->getSaml2User();
    $userData = [
        'id' => $user->getUserId(),
        'attributes' => $user->getAttributes(),
        'assertion' => $user->getRawSamlAssertion()
    ];
        $laravelUser = 1; //find user by ID or attribute
        //if it does not exist create it and go on  or show an error message
        Auth::login($laravelUser);
});