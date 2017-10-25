<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapWebRoutes();

        $this->mapJudgeRoutes();

        $this->mapStudentRoutes();

        $this->mapAdminRoutes();
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
             ->namespace($this->namespace)
             ->group(base_path('routes/web.php'));
    }

    protected function mapJudgeRoutes()
    {
        Route::middleware('judge_api')
            ->namespace($this->namespace)
            ->group(base_path('routes/judge/api.php'));
        Route::middleware('judge_web')
            ->namespace($this->namespace)
            ->group(base_path('routes/judge/web.php'));

    }

    protected function mapStudentRoutes()
    {
        Route::middleware('student_api')
            ->namespace($this->namespace)
            ->group(base_path('routes/student/api.php'));
        Route::middleware('student_web')
            ->namespace($this->namespace)
            ->group(base_path('routes/student/web.php'));
}

    protected function mapAdminRoutes()
    {
        Route::middleware('admin_api')
             ->namespace($this->namespace)
             ->group(base_path('routes/admin/api.php'));
        Route::middleware('admin_web')
             ->namespace($this->namespace)
             ->group(base_path('routes/admin/web.php'));
    }
}
