<?php

Route::get('/student/home', function () {
    $users[] = Auth::guard('student')->user();

    return view('student.home');
})->name('student.home');

