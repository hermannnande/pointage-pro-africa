<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Commercial', 'code' => 'COM', 'site_id' => 1],
            ['name' => 'Logistique', 'code' => 'LOG', 'site_id' => 2],
            ['name' => 'Production', 'code' => 'PROD', 'site_id' => 2],
            ['name' => 'Administration', 'code' => 'ADM', 'site_id' => 3],
            ['name' => 'Ressources Humaines', 'code' => 'RH', 'site_id' => 3],
        ];
        
        foreach ($departments as $dept) {
            Department::create(array_merge($dept, [
                'company_id' => 1,
                'is_active' => true,
            ]));
        }
    }
}

