<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Show;

class ShowController extends Controller
{
    public function index(Request $request)
    {
        $shows = Show::all();
        return response()->json($shows, 200);
    }

    public function show(Request $request, $id)
    {
        $show = Show::findOrFail($id);
        return response()->json($show, 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'present',
            'entry_cap' => 'required|integer|min:1',
            'submission_start' => 'required|date',
            'submission_end' => 'required|date|after:submission_start|before_or_equal:judging_start',
            'judging_start' => 'required|date',
            'judging_end' => 'required|date| after:judging_start'

        ]);
        $show = Show::create($request->all());
        $show->save();
        return response()->json($show, 201);
    }
}
