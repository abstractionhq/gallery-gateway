@extends('layouts.default')

@section('title', 'Welcome')

@section('content')
  <ul>
    <li><a href="{{ route('admin.login') }}">Admin</a></li>
    <li><a href="{{ route('student.login') }}">Student</a></li>
    <li><a href="{{ route('judge.login') }}">Judge</a></li>
  </ul>
@endsection
