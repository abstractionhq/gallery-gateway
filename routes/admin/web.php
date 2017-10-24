<?php

Route::group(['prefix' => 'admin'], function () {
    Route::get('/home', function (Request $request) {
        return view('admin.home');
    })->name('admin.home');
});
