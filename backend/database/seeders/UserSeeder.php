<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        $superAdmin = User::create([
            'company_id' => 1,
            'employee_code' => 'ADM-001',
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'superadmin@demo-ci.com',
            'phone' => '+225 01 01 01 01 01',
            'password' => Hash::make('password'),
            'pin' => '0000',
            'site_id' => 3,
            'department_id' => 5,
            'position' => 'Directeur Général',
            'contract_type' => 'CDI',
            'hire_date' => '2020-01-01',
            'base_salary' => 2000000,
            'work_schedule_id' => 1,
            'is_active' => true,
        ]);
        $superAdmin->assignRole('super_admin');
        
        // Admin RH
        $admin = User::create([
            'company_id' => 1,
            'employee_code' => 'RH-001',
            'first_name' => 'Yao',
            'last_name' => 'Pascal',
            'email' => 'admin@demo-ci.com',
            'phone' => '+225 02 02 02 02 02',
            'password' => Hash::make('password'),
            'pin' => '1111',
            'site_id' => 3,
            'department_id' => 5,
            'position' => 'Responsable RH',
            'contract_type' => 'CDI',
            'hire_date' => '2021-01-01',
            'base_salary' => 800000,
            'work_schedule_id' => 1,
            'is_active' => true,
        ]);
        $admin->assignRole('admin');
        
        // Manager Commercial
        $manager = User::create([
            'company_id' => 1,
            'employee_code' => 'MGR-001',
            'first_name' => 'Kouassi',
            'last_name' => 'Jean',
            'email' => 'manager@demo-ci.com',
            'phone' => '+225 03 03 03 03 03',
            'password' => Hash::make('password'),
            'pin' => '2222',
            'site_id' => 1,
            'department_id' => 1,
            'position' => 'Manager Commercial',
            'contract_type' => 'CDI',
            'hire_date' => '2021-06-01',
            'base_salary' => 600000,
            'work_schedule_id' => 1,
            'is_active' => true,
        ]);
        $manager->assignRole('manager');
        
        // Employés
        $employees = [
            [
                'employee_code' => 'EMP-001',
                'first_name' => 'Kouassi',
                'last_name' => 'Ama',
                'email' => 'kouassi.ama@demo-ci.com',
                'phone' => '+225 05 01 01 01 01',
                'pin' => '1234',
                'site_id' => 1,
                'department_id' => 1,
                'manager_id' => 3,
                'position' => 'Vendeur',
                'base_salary' => 150000,
            ],
            [
                'employee_code' => 'EMP-002',
                'first_name' => 'Yao',
                'last_name' => 'Marie',
                'email' => 'yao.marie@demo-ci.com',
                'phone' => '+225 05 02 02 02 02',
                'pin' => '2345',
                'site_id' => 1,
                'department_id' => 1,
                'manager_id' => 3,
                'position' => 'Caissière',
                'base_salary' => 140000,
            ],
            [
                'employee_code' => 'EMP-003',
                'first_name' => 'Bamba',
                'last_name' => 'Koné',
                'email' => 'bamba.kone@demo-ci.com',
                'phone' => '+225 05 03 03 03 03',
                'pin' => '3456',
                'site_id' => 2,
                'department_id' => 2,
                'manager_id' => 3,
                'position' => 'Magasinier',
                'base_salary' => 160000,
            ],
            [
                'employee_code' => 'EMP-004',
                'first_name' => 'Traoré',
                'last_name' => 'Salif',
                'email' => 'traore.salif@demo-ci.com',
                'phone' => '+225 05 04 04 04 04',
                'pin' => '4567',
                'site_id' => 2,
                'department_id' => 3,
                'manager_id' => 3,
                'position' => 'Ouvrier',
                'base_salary' => 120000,
            ],
            [
                'employee_code' => 'EMP-005',
                'first_name' => 'Koné',
                'last_name' => 'Fanta',
                'email' => 'kone.fanta@demo-ci.com',
                'phone' => '+225 05 05 05 05 05',
                'pin' => '5678',
                'site_id' => 1,
                'department_id' => 1,
                'manager_id' => 3,
                'position' => 'Vendeuse',
                'base_salary' => 145000,
            ],
        ];
        
        foreach ($employees as $emp) {
            $user = User::create(array_merge($emp, [
                'company_id' => 1,
                'password' => Hash::make('password'),
                'contract_type' => 'CDI',
                'hire_date' => '2023-01-01',
                'work_schedule_id' => 1,
                'annual_leave_days' => 22,
                'used_leave_days' => 4,
                'is_active' => true,
            ]));
            $user->assignRole('employee');
        }
    }
}

