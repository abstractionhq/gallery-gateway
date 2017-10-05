<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Saml2::login(URL::full() . "/something");
});

Route::get('/logout', function () {
    return Saml2::logout();
});

Route::group(['prefix' => 'admin'], function () {
  Route::get('/login', 'AdminAuth\LoginController@showLoginForm')->name('login');
  Route::post('/login', 'AdminAuth\LoginController@login');
  Route::post('/logout', 'AdminAuth\LoginController@logout')->name('logout');
});

Route::group(['prefix' => 'student'], function () {
  Route::get('/login', 'StudentAuth\LoginController@showLoginForm')->name('login');
  Route::post('/login', 'StudentAuth\LoginController@login');
  Route::post('/logout', 'StudentAuth\LoginController@logout')->name('logout');
});

Route::group(['prefix' => 'judge'], function () {
  Route::get('/login', 'JudgeAuth\LoginController@showLoginForm')->name('login');
  Route::post('/login', 'JudgeAuth\LoginController@login');
  Route::post('/logout', 'JudgeAuth\LoginController@logout')->name('logout');
});
