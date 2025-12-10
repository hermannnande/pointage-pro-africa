<?php

namespace Database\Seeders;

use App\Models\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $holidays = [
            ['name' => 'Nouvel An', 'date' => '2025-01-01'],
            ['name' => 'Fête du Travail', 'date' => '2025-05-01'],
            ['name' => 'Fête de l\'Indépendance', 'date' => '2025-08-07'],
            ['name' => 'Toussaint', 'date' => '2025-11-01'],
            ['name' => 'Noël', 'date' => '2025-12-25'],
        ];
        
        foreach ($holidays as $holiday) {
            Holiday::create(array_merge($holiday, [
                'company_id' => 1,
                'year' => 2025,
                'scope' => 'COMPANY',
                'country_code' => 'CI',
                'is_paid' => true,
                'is_active' => true,
            ]));
        }
    }
}

