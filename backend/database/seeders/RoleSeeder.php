<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les rôles
        $superAdmin = Role::create(['name' => 'super_admin', 'guard_name' => 'api']);
        $admin = Role::create(['name' => 'admin', 'guard_name' => 'api']);
        $manager = Role::create(['name' => 'manager', 'guard_name' => 'api']);
        $employee = Role::create(['name' => 'employee', 'guard_name' => 'api']);
        $comptable = Role::create(['name' => 'comptable', 'guard_name' => 'api']);
        
        // Créer des permissions (exemples)
        $permissions = [
            'view_dashboard',
            'manage_employees',
            'manage_attendances',
            'manage_leave_requests',
            'view_reports',
            'manage_sites',
            'manage_settings',
        ];
        
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }
        
        // Assigner les permissions aux rôles
        $superAdmin->givePermissionTo(Permission::all());
        $admin->givePermissionTo(Permission::all());
        $manager->givePermissionTo([
            'view_dashboard',
            'manage_attendances',
            'manage_leave_requests',
            'view_reports',
        ]);
        $comptable->givePermissionTo(['view_dashboard', 'view_reports']);
    }
}

