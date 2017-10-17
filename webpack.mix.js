const mix = require('laravel-mix')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/src/admin/app.js', 'public/js/admin')
   .js('resources/assets/js/src/judge/app.js', 'public/js/judge')
   .js('resources/assets/js/src/student/app.js', 'public/js/student')
   .sass('resources/assets/sass/app.scss', 'public/css')
