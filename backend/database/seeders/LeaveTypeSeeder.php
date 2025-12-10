<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            [
                'name' => 'Congé payé',
                'code' => 'CP',
                'description' => 'Congé annuel payé',
                'max_days_per_year' => 22,
                'requires_approval' => true,
                'is_paid' => true,
                'requires_document' => false,
                'color' => '#10B981',
            ],
            [
                'name' => 'Congé maladie',
                'code' => 'CM',
                'description' => 'Congé pour raison de santé',
                'max_days_per_year' => null,
                'requires_approval' => true,
                'is_paid' => true,
                'requires_document' => true,
                'color' => '#EF4444',
            ],
            [
                'name' => 'Permission',
                'code' => 'PERM',
                'description' => 'Permission de quelques heures',
                'max_days_per_year' => 5,
                'requires_approval' => true,
                'is_paid' => true,
                'requires_document' => false,
                'color' => '#F59E0B',
            ],
            [
                'name' => 'Congé sans solde',
                'code' => 'CSS',
                'description' => 'Congé non rémunéré',
                'max_days_per_year' => null,
                'requires_approval' => true,
                'is_paid' => false,
                'requires_document' => false,
                'color' => '#6B7280',
            ],
        ];
        
        foreach ($leaveTypes as $type) {
            LeaveType::create(array_merge($type, [
                'company_id' => 1,
                'is_active' => true,
            ]));
        }
    }
}

