<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
    </head>
    <body>
        <div class="flex-center position-ref full-height">
            <div class="content">
                <ul>
                    <li><a href="{{ route('admin.login') }}">Admin</a></li>
                    <li><a href="{{ route('student.login') }}">Student</a></li>
                    <li><a href="{{ route('judge.login') }}">Judge</a></li>
                </ul>
            </div>
        </div>
    </body>
</html>
