<?php

namespace App\Listeners;

use Aacotroneo\Saml2\Events\Saml2LogoutEvent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LogoutEventListener
{
    /**
     * Someone is attempting to logout, and Saml2 has received the event to
     * process. It's now our job to look up the user and log them out.
     *
     * @param  Saml2LoginEvent  $event
     * @return void
     */
    public function handle(Saml2LogoutEvent $event)
    {
        // attempt to find if any user models are logged in, and unlog
        $user = Auth::guard('admin')->user();
        if ($user) {
            Auth::guard('admin')->logout($user);
        }
        $user = Auth::guard('student')->user();
        if ($user) {
            Auth::guard('student')->logout($user);
        }
        $user = Auth::guard('judge')->user();
        if ($user) {
            Auth::guard('judge')->logout($user);
        }
    }
}
