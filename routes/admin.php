<?php

Route::get('/admin/home', function (Request $request) {
    $users[] = Auth::guard('admin')->user();

    return view('admin.home');
})->name('admin.home');

