<?php

namespace App\Models;

use Imtigger\LaravelJobStatus\JobStatus as BaseJobStatus;

class JobStatus extends BaseJobStatus
{
    protected $appends = [
        'progress_percentage'
    ];
}
