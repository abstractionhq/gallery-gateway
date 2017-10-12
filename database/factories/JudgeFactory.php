<?php

use Faker\Generator as Faker;


$factory->define(App\Judge::class, function (Faker $faker) {
    return [
        'username' => $faker->username,
        'remember_token' => str_random(10),
    ];
});
