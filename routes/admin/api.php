<?php

Route::group(['prefix' => 'admin'], function () {
    Route::group(['prefix' => 'show'], function () {
        Route::post('/', 'ShowController@create');
    });
});
