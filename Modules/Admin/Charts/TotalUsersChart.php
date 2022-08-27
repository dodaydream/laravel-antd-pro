<?php

namespace Modules\Admin\Charts;

use App\Models\User;
use ArielMejiaDev\LarapexCharts\LarapexChart;
use Carbon\Carbon;
use Carbon\CarbonInterval;
use Illuminate\Support\Facades\DB;

class TotalUsersChart
{
    protected $chart;

    public function __construct(LarapexChart $chart)
    {
        $this->chart = $chart;
    }

    public function build()
    {
        $users = User::where('created_at', '>=', now()->subDays(30))
                ->selectRaw('count(*) as total, DATE(created_at) as date')
                ->groupBy('date')
                ->pluck('total', 'date');

        $counts = collect([]);

        $period = collect(now()->subDays(30)->daysUntil(now()));

        $period->each(function ($date) use ($users, $counts) {
            $counts->push(isset($users[$date->format('Y-m-d')]) ? $users[$date->format('Y-m-d')] : 0);
        });

        return $this->chart->areaChart()
            ->setTitle($counts->sum())
            ->setToolbar(false)
            ->setSubTitle('New Users')
            ->addData('Users', $counts->toArray())
            ->setXAxis($period->map(function ($date) {
                return $date->format('M d');
            })->toArray())
            ->setSparklines()
            ->setStroke(2)
            ->toVue();
    }

}
