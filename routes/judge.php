<?php

Route::get('/judge/home', function () {
    $users[] = Auth::user();
    $users[] = Auth::guard()->user();
    $users[] = Auth::guard('judge')->user();

    //dd($users);

    return view('judge.home');
})->name('judge.home');

