<?php

namespace Database\Seeders;

use App\Models\Site;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    public function run(): void
    {
        $sites = [
            [
                'name' => 'Boutique Bingerville',
                'code' => 'BING-001',
                'address' => 'Bingerville, Route de Bassam',
                'latitude' => 5.3599,
                'longitude' => -3.8997,
                'radius_meters' => 100,
                'phone' => '+225 27 XX XX XX XX',
            ],
            [
                'name' => 'Entrepôt Yopougon',
                'code' => 'YOP-001',
                'address' => 'Yopougon, Zone industrielle',
                'latitude' => 5.3364,
                'longitude' => -4.0890,
                'radius_meters' => 150,
                'phone' => '+225 27 XX XX XX XX',
            ],
            [
                'name' => 'Bureau Cocody',
                'code' => 'COC-001',
                'address' => 'Cocody, Riviera',
                'latitude' => 5.3599,
                'longitude' => -3.9742,
                'radius_meters' => 50,
                'phone' => '+225 27 XX XX XX XX',
            ],
        ];
        
        foreach ($sites as $site) {
            Site::create(array_merge($site, [
                'company_id' => 1,
                'is_active' => true,
            ]));
        }
    }
}

