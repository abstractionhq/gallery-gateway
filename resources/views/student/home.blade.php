<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title></title>
</head>
<body>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            text-align: center;
        }
    </style>
    <h1>Hello, {{ Auth::guard('student')->user()->username }}</h1>
    <p>You are logged in as Student!</p>
    <a href="{{ route('logout') }}">Logout</a>
</body>
</html>
