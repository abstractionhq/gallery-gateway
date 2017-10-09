<html>
<head>
</head>
<body>
<div>
    Hello, {{ Auth::guard('admin')->user()->username }}
</div>
</body>
</html>