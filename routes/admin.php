<?php

Route::group(['prefix' => 'admin'], function () {
    Route::get('/home', function (Request $request) {
        $users[] = Auth::guard('admin')->user();
        return view('admin.home');
    })->name('admin.home');

    // Show related routes
    Route::group(['prefix' => 'show', 'middleware' => ['JsonApi']], function () {
        Route::post('/', 'ShowController@create');
    });
});
