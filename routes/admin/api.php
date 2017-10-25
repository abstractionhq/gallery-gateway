<?php

Route::group(['prefix' => 'admin'], function () {
    Route::group(['prefix' => 'show'], function () {
        Route::get('/', 'ShowController@index');
        Route::get('/{id}', 'ShowController@show');
        Route::post('/', 'ShowController@create');
    });
});
