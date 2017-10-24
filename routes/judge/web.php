<?php

Route::get('/judge/home', function () {
    $users[] = Auth::guard('judge')->user();

    return view('judge.home');
})->name('judge.home');
