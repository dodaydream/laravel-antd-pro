<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet">
    @vite('Modules/Admin/Resources/js/app.js')
    @routes(['admin', 'fortify'])
    @inertiaHead
</head>
<body>
@inertia
</body>
</html>
