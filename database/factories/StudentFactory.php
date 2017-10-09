<?php

use Faker\Generator as Faker;

$factory->define(App\Student::class, function (Faker $faker) {
    return [
        'username' => $faker->username,
        'display_name' => $faker->name,
        'remember_token' => str_random(10),
    ];
});
