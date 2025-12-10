<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        Company::create([
            'name' => 'Entreprise Demo Côte d\'Ivoire',
            'slug' => 'entreprise-demo-ci',
            'email' => 'contact@demo-ci.com',
            'phone' => '+225 27 XX XX XX XX',
            'address' => 'Abidjan, Plateau',
            'currency' => 'FCFA',
            'timezone' => 'Africa/Abidjan',
            'language' => 'fr',
            'country' => 'CI',
            'is_active' => true,
            'settings' => json_encode([
                'gps_required' => true,
                'selfie_required' => false,
                'offline_enabled' => true,
            ]),
        ]);
    }
}

