<?php

namespace App\Http\Controllers;

use Exception;
use Aacotroneo\Saml2\Facades\Saml2Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Redirect to the application's login form.
     *
     * @return \Illuminate\Http\Response
     */
    public function login()
    {
        $currRoute = \Route::currentRouteName();
        $redirTo = '';
        switch ($currRoute) {
            case 'admin.login':
                $redirTo = route('admin.home');
                break;
            case 'student.login':
                $redirTo = route('student.home');
                break;
            case 'judge.login':
                $redirTo = route('judge.home');
                break;
            default:
                throw Exception('unknown route name');
        }

        return Saml2Auth::login($redirTo);
    }

    /**
     * Redirect to the application's SAML logout.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        return Saml2Auth::logout();
    }
}
