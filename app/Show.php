<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    protected $fillable = ['name', 'description', 'entry_cap', 'submission_start', 'submission_end', 'judging_start', 'judging_end'];
}
