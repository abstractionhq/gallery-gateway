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
            throw new Exception('Username Not Found');
        }

        switch ($url) {
            case route('admin.home'):
                // Wants to login as Admin
                $laravelUser = Admin::where('username', $username)->first();
                if (!isset($laravelUser)) {
                    throw new Exception('You are Not an Administrator');
                }
                Auth::guard('admin')->login($laravelUser);
                break;
            case route('student.home'):
                // Wants to login as Student
                $laravelUser = Student::where('username', $username)->first();
                if (!isset($laravelUser)) {
                    throw new Exception('You are Not a Student');
                }
                Auth::guard('student')->login($laravelUser);
                break;
            case route('judge.home'):
                // Wants to login as Judge
                $laravelUser = Judge::where('username', $username)->first();
                if (!isset($laravelUser)) {
                    throw new Exception('You are Not a Judge');
                }
                Auth::guard('judge')->login($laravelUser);
                break;
            default:
                throw new Exception('Unknown Login Destination');
        }

        session(['name_id' => $user->getNameId()]);
        session(['session_index' => $user->getSessionIndex()]);
    }
}
