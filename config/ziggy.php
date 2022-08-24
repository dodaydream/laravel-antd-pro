<?php

return [
    'groups' => [
        'app' => ['app.*'],
        'admin' => ['admin.*'],
        'fortify' => ['login','logout', 'password.*', 'two-factor.*']
    ]
];
