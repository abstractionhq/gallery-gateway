<?php

namespace App\Listeners;

use Exception;
use App\Admin;
use App\Student;
use App\Judge;
use App\Events\Event;
use Aacotroneo\Saml2\Events\Saml2LoginEvent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LoginEventListener
{

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Someone is attempting to login, and Saml2 has received the event to
     * process. It's now our job to look up the user and log in.
     *
     * @param  Saml2LoginEvent  $event
     * @return void
     */
    public function handle(Saml2LoginEvent $event)
    {
        // TODO uhh this needs to protect against messageid replay attacks?
        $user = $event->getSaml2User();
        $url = $user->getIntendedUrl();
        // TODO when going live, this 'email' is probably wrong
        $username = $user->getAttributes()['email'][0];
        // TODO when going live, this is unnecessary
        $username = str_replace('@example.com', '', $username);

        if ($username === null || $username === '') {
            throw new Exception('username not found');
        }

        if ($url === route('admin.home')) {
            // want to login as admin
            $laravelUser = Admin::where('username', $username)->first();
            if (!isset($laravelUser)) {
                throw new Exception('you are not an administrator');
            }
            Auth::guard('admin')->login($laravelUser);
        } elseif ($url === route('student.home')) {
            // do something
        } elseif ($url === route('judge.home')) {
            // do something
        } else {
            throw new Exception('unknown login destination');
        }
        session(['name_id' => $user->getNameId()]);
        session(['session_index' => $user->getSessionIndex()]);
    }
}
