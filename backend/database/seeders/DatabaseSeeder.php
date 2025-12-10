<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CompanySeeder::class,
            SiteSeeder::class,
            DepartmentSeeder::class,
            WorkScheduleSeeder::class,
            UserSeeder::class,
            LeaveTypeSeeder::class,
            HolidaySeeder::class,
            AttendanceSeeder::class,
            LeaveRequestSeeder::class,
        ]);
    }
}

