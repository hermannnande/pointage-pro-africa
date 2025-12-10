const { Company, User, Site, LeaveType, WorkSchedule } = require('../models');
require('dotenv').config();

/**
 * Script de seed - Données de test
 */
async function seed() {
  try {
    console.log('🌱 Début du seeding...');

    // Créer une entreprise de test
    const company = await Company.create({
      name: 'Entreprise Test CI',
      slug: 'entreprise-test-ci',
      country: 'CI',
      currency: 'XOF',
      timezone: 'Africa/Abidjan',
      is_active: true
    });
    console.log('✅ Entreprise créée:', company.name);

    // Créer des sites
    const siteBingerville = await Site.create({
      company_id: company.id,
      name: 'Boutique Bingerville',
      address: 'Bingerville, Abidjan',
      city: 'Abidjan',
      latitude: 5.3599, 
      longitude: -3.8920,
      radius_meters: 100
    });

    const siteYopougon = await Site.create({
      company_id: company.id,
      name: 'Entrepôt Yopougon',
      address: 'Yopougon, Abidjan',
      city: 'Abidjan',
      latitude: 5.3364,
      longitude: -4.0815,
      radius_meters: 150
    });
    console.log('✅ Sites créés');

    // Créer un super admin
    const superAdmin = await User.create({
      company_id: company.id,
      employee_code: 'ADMIN001',
      first_name: 'Super',
      last_name: 'Administrateur',
      email: 'admin@pointage.ci',
      phone: '+2250707070707',
      password: 'admin123',
      pin_code: '1234',
      role: 'super_admin',
      job_title: 'Administrateur Système',
      is_active: true,
      leave_balance: 0
    });
    console.log('✅ Super Admin créé - Email: admin@pointage.ci / Pass: admin123');

    // Créer un admin RH
    const adminRH = await User.create({
      company_id: company.id,
      site_id: siteBingerville.id,
      employee_code: 'RH001',
      first_name: 'Marie',
      last_name: 'Kouassi',
      email: 'rh@pointage.ci',
      phone: '+2250708080808',
      password: 'rh123',
      pin_code: '2345',
      role: 'admin',
      job_title: 'Responsable RH',
      is_active: true,
      leave_balance: 0
    });
    console.log('✅ Admin RH créé - Email: rh@pointage.ci / Pass: rh123');

    // Créer un manager
    const manager = await User.create({
      company_id: company.id,
      site_id: siteBingerville.id,
      employee_code: 'MGR001',
      first_name: 'Jean',
      last_name: 'Kouamé',
      email: 'manager@pointage.ci',
      phone: '+2250709090909',
      password: 'manager123',
      pin_code: '3456',
      role: 'manager',
      job_title: 'Chef de Magasin',
      is_active: true,
      leave_balance: 22
    });
    console.log('✅ Manager créé - Email: manager@pointage.ci / Pass: manager123');

    // Créer des employés
    const employee1 = await User.create({
      company_id: company.id,
      site_id: siteBingerville.id,
      manager_id: manager.id,
      employee_code: 'EMP001',
      first_name: 'Aya',
      last_name: 'Diallo',
      email: 'aya@pointage.ci',
      phone: '+2250701010101',
      password: 'employee123',
      pin_code: '4567',
      role: 'employee',
      job_title: 'Vendeuse',
      contract_type: 'cdi',
      is_active: true,
      leave_balance: 22
    });

    const employee2 = await User.create({
      company_id: company.id,
      site_id: siteBingerville.id,
      manager_id: manager.id,
      employee_code: 'EMP002',
      first_name: 'Kofi',
      last_name: 'Mensah',
      email: 'kofi@pointage.ci',
      phone: '+2250702020202',
      password: 'employee123',
      pin_code: '5678',
      role: 'employee',
      job_title: 'Caissier',
      contract_type: 'cdi',
      is_active: true,
      leave_balance: 22
    });
    console.log('✅ Employés créés');

    // Créer des types de congés
    const leaveTypes = [
      {
        company_id: company.id,
        name: 'Congé Payé',
        code: 'CP',
        color: '#10B981',
        is_paid: true,
        requires_approval: true,
        max_days_per_year: 22
      },
      {
        company_id: company.id,
        name: 'Congé Maladie',
        code: 'CM',
        color: '#EF4444',
        is_paid: true,
        requires_approval: true,
        requires_document: true,
        max_days_per_year: 15
      },
      {
        company_id: company.id,
        name: 'Permission',
        code: 'PERM',
        color: '#F59E0B',
        is_paid: false,
        requires_approval: true,
        max_days_per_year: 5
      }
    ];

    await LeaveType.bulkCreate(leaveTypes);
    console.log('✅ Types de congés créés');

    // Créer des horaires de travail pour l'employé 1 (Lundi-Vendredi 8h-17h)
    const workSchedules = [];
    for (let day = 1; day <= 5; day++) {
      workSchedules.push({
        user_id: employee1.id,
        day_of_week: day,
        start_time: '08:00:00',
        end_time: '17:00:00',
        is_working_day: true,
        shift_name: 'Journée'
      });
    }
    await WorkSchedule.bulkCreate(workSchedules);
    console.log('✅ Horaires de travail créés');

    console.log('\n🎉 Seeding terminé avec succès!');
    console.log('\n📋 Comptes de test créés:');
    console.log('------------------------------');
    console.log('Super Admin:');
    console.log('  Email: admin@pointage.ci');
    console.log('  Pass: admin123');
    console.log('  PIN: 1234');
    console.log('\nAdmin RH:');
    console.log('  Email: rh@pointage.ci');
    console.log('  Pass: rh123');
    console.log('  PIN: 2345');
    console.log('\nManager:');
    console.log('  Email: manager@pointage.ci');
    console.log('  Pass: manager123');
    console.log('  PIN: 3456');
    console.log('\nEmployé:');
    console.log('  Email: aya@pointage.ci');
    console.log('  Pass: employee123');
    console.log('  PIN: 4567');
    console.log('------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
}

seed();

