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
})->name('home');

Route::get('/logout', 'AuthController@logout')->name('logout');

Route::group(['prefix' => 'admin'], function () {
  Route::get('/login', 'AuthController@login')->name('admin.login');
});

Route::group(['prefix' => 'student'], function () {
  Route::get('/login', 'AuthController@login')->name('student.login');
});

Route::group(['prefix' => 'judge'], function () {
  Route::get('/login', 'AuthController@login')->name('judge.login');
});
