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
    return view('welcome');
});

Route::group(['prefix' => 'admin'], function () {
  Route::get('/login', 'AdminAuth\LoginController@showLoginForm')->name('admin.login');
  Route::post('/logout', 'AdminAuth\LoginController@logout')->name('admin.logout');
});

Route::group(['prefix' => 'student'], function () {
  Route::get('/login', 'StudentAuth\LoginController@showLoginForm')->name('student.login');
  Route::post('/logout', 'StudentAuth\LoginController@logout')->name('student.logout');
});

Route::group(['prefix' => 'judge'], function () {
  Route::get('/login', 'JudgeAuth\LoginController@showLoginForm')->name('judge.login');
  Route::post('/logout', 'JudgeAuth\LoginController@logout')->name('judge.logout');
});
