const { Attendance, User, Site, Justification, WorkSchedule } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
const { calculateDistance } = require('../utils/gps');

// Pointer l'entrée (Clock In)
exports.clockIn = async (req, res, next) => {
  try {
    const { latitude, longitude, site_id, notes } = req.body;
    const userId = req.user.id;
    const today = moment().format('YYYY-MM-DD');

    // Vérifier si déjà pointé aujourd'hui
    const existingAttendance = await Attendance.findOne({
      where: {
        user_id: userId,
        date: today
      }
    });

    if (existingAttendance && existingAttendance.clock_in) {
      return res.status(400).json({
        error: 'Vous avez déjà pointé votre entrée aujourd\'hui.',
        attendance: existingAttendance
      });
    }

    // Vérifier la géolocalisation si fournie
    let isWithinRange = true;
    let site = null;

    if (latitude && longitude && site_id) {
      site = await Site.findByPk(site_id);
      
      if (site && site.latitude && site.longitude) {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          parseFloat(site.latitude),
          parseFloat(site.longitude)
        );

        const toleranceMeters = site.radius_meters || parseInt(process.env.GPS_TOLERANCE) || 100;
        
        if (distance > toleranceMeters) {
          isWithinRange = false;
          return res.status(400).json({
            error: `Vous êtes trop loin du site (${Math.round(distance)}m). Distance maximale autorisée: ${toleranceMeters}m.`,
            distance: Math.round(distance),
            max_distance: toleranceMeters
          });
        }
      }
    }

    // Obtenir l'horaire de travail de l'utilisateur
    const dayOfWeek = moment().day();
    const workSchedule = await WorkSchedule.findOne({
      where: {
        user_id: userId,
        day_of_week: dayOfWeek,
        is_working_day: true
      }
    });

    // Calculer le retard
    let lateMinutes = 0;
    let status = 'present';

    if (workSchedule) {
      const scheduledStart = moment(workSchedule.start_time, 'HH:mm:ss');
      const actualStart = moment();
      const lateTolerance = parseInt(process.env.LATE_TOLERANCE_MINUTES) || 10;
      
      const diffMinutes = actualStart.diff(scheduledStart, 'minutes');
      
      if (diffMinutes > lateTolerance) {
        lateMinutes = diffMinutes;
        status = 'late';
      }
    }

    // Créer ou mettre à jour le pointage
    let attendance;
    
    if (existingAttendance) {
      attendance = await existingAttendance.update({
        clock_in: new Date(),
        clock_in_latitude: latitude,
        clock_in_longitude: longitude,
        site_id: site_id || req.user.site_id,
        late_minutes: lateMinutes,
        status,
        notes,
        is_synced: true,
        synced_at: new Date()
      });
    } else {
      attendance = await Attendance.create({
        user_id: userId,
        site_id: site_id || req.user.site_id,
        date: today,
        clock_in: new Date(),
        clock_in_latitude: latitude,
        clock_in_longitude: longitude,
        late_minutes: lateMinutes,
        status,
        notes,
        is_synced: true,
        synced_at: new Date()
      });
    }

    res.status(201).json({
      message: lateMinutes > 0 ? `Entrée pointée avec ${lateMinutes} minutes de retard` : 'Entrée pointée avec succès',
      attendance,
      late_minutes: lateMinutes,
      status
    });
  } catch (error) {
    next(error);
  }
};

// Pointer la sortie (Clock Out)
exports.clockOut = async (req, res, next) => {
  try {
    const { attendance_id, latitude, longitude, notes } = req.body;
    const userId = req.user.id;

    // Si pas d'ID fourni, chercher le pointage du jour
    let attendance;
    
    if (attendance_id) {
      attendance = await Attendance.findOne({
        where: { id: attendance_id, user_id: userId }
      });
    } else {
      const today = moment().format('YYYY-MM-DD');
      attendance = await Attendance.findOne({
        where: {
          user_id: userId,
          date: today
        }
      });
    }

    if (!attendance) {
      return res.status(404).json({
        error: 'Aucun pointage d\'entrée trouvé pour aujourd\'hui.'
      });
    }

    if (!attendance.clock_in) {
      return res.status(400).json({
        error: 'Vous devez d\'abord pointer votre entrée.'
      });
    }

    if (attendance.clock_out) {
      return res.status(400).json({
        error: 'Vous avez déjà pointé votre sortie.',
        attendance
      });
    }

    // Calculer les heures travaillées
    const clockInTime = moment(attendance.clock_in);
    const clockOutTime = moment();
    const totalHours = clockOutTime.diff(clockInTime, 'hours', true);
    const roundedHours = Math.round(totalHours * 100) / 100;

    // Calculer les heures supplémentaires (si > 8h par jour)
    const standardHours = 8;
    const overtimeHours = Math.max(0, roundedHours - standardHours);

    // Mettre à jour le pointage
    await attendance.update({
      clock_out: new Date(),
      clock_out_latitude: latitude,
      clock_out_longitude: longitude,
      total_hours: roundedHours,
      overtime_hours: overtimeHours,
      notes: notes || attendance.notes,
      is_synced: true,
      synced_at: new Date()
    });

    res.json({
      message: 'Sortie pointée avec succès',
      attendance,
      total_hours: roundedHours,
      overtime_hours: overtimeHours
    });
  } catch (error) {
    next(error);
  }
};

// Synchroniser les pointages offline
exports.syncAttendances = async (req, res, next) => {
  try {
    const { attendances } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({
        error: 'Aucun pointage à synchroniser.'
      });
    }

    const syncedAttendances = [];
    const errors = [];

    for (const att of attendances) {
      try {
        const { date, clock_in, clock_out, latitude, longitude, ...rest } = att;

        // Vérifier si existe déjà
        let existing = await Attendance.findOne({
          where: { user_id: userId, date }
        });

        if (existing) {
          // Mettre à jour seulement si le pointage local est plus récent
          if (!existing.is_synced || moment(clock_in).isAfter(existing.clock_in)) {
            await existing.update({
              clock_in: clock_in || existing.clock_in,
              clock_out: clock_out || existing.clock_out,
              ...rest,
              is_synced: true,
              synced_at: new Date()
            });
            syncedAttendances.push(existing);
          }
        } else {
          // Créer nouveau
          const newAtt = await Attendance.create({
            user_id: userId,
            date,
            clock_in,
            clock_out,
            clock_in_latitude: latitude,
            clock_in_longitude: longitude,
            ...rest,
            is_synced: true,
            synced_at: new Date()
          });
          syncedAttendances.push(newAtt);
        }
      } catch (err) {
        errors.push({
          date: att.date,
          error: err.message
        });
      }
    }

    res.json({
      message: 'Synchronisation terminée',
      synced: syncedAttendances.length,
      errors: errors.length,
      details: errors
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir l'historique des pointages de l'utilisateur
exports.getMyAttendances = async (req, res, next) => {
  try {
    const { start_date, end_date, limit = 30 } = req.query;
    const userId = req.user.id;

    const where = { user_id: userId };

    if (start_date && end_date) {
      where.date = {
        [Op.between]: [start_date, end_date]
      };
    } else if (start_date) {
      where.date = {
        [Op.gte]: start_date
      };
    }

    const attendances = await Attendance.findAll({
      where,
      include: [
        { model: Site, as: 'site', attributes: ['id', 'name'] },
        { model: Justification, as: 'justification' }
      ],
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    // Calculer les statistiques
    const stats = {
      total_days: attendances.length,
      total_hours: attendances.reduce((sum, att) => sum + parseFloat(att.total_hours || 0), 0),
      overtime_hours: attendances.reduce((sum, att) => sum + parseFloat(att.overtime_hours || 0), 0),
      late_count: attendances.filter(att => att.status === 'late').length,
      absent_count: attendances.filter(att => att.status === 'absent').length
    };

    res.json({
      attendances,
      stats
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les présences d'une équipe (pour managers)
exports.getTeamAttendances = async (req, res, next) => {
  try {
    const { date, site_id } = req.query;
    const targetDate = date || moment().format('YYYY-MM-DD');

    // Construire la requête selon le rôle
    let userWhere = {};

    if (req.user.role === 'manager') {
      // Manager voit son équipe
      userWhere.manager_id = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admin voit toute l'entreprise
      userWhere.company_id = req.user.company_id;
      if (site_id) {
        userWhere.site_id = site_id;
      }
    }

    // Récupérer tous les employés concernés
    const employees = await User.findAll({
      where: { ...userWhere, is_active: true },
      attributes: ['id', 'first_name', 'last_name', 'employee_code', 'job_title'],
      include: [
        {
          model: Attendance,
          as: 'attendances',
          where: { date: targetDate },
          required: false
        }
      ]
    });

    // Formater la réponse
    const attendances = employees.map(emp => ({
      user: {
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        employee_code: emp.employee_code,
        job_title: emp.job_title
      },
      attendance: emp.attendances[0] || null,
      status: emp.attendances[0]?.status || 'absent'
    }));

    res.json({
      date: targetDate,
      attendances
    });
  } catch (error) {
    next(error);
  }
};

// Corriger un pointage (manager/admin uniquement)
exports.correctAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clock_in, clock_out, reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        error: 'Un motif de modification est requis.'
      });
    }

    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({
        error: 'Pointage non trouvé.'
      });
    }

    // Vérifier les permissions
    if (req.user.role === 'manager') {
      const employee = await User.findByPk(attendance.user_id);
      if (employee.manager_id !== req.user.id) {
        return res.status(403).json({
          error: 'Vous ne pouvez modifier que les pointages de votre équipe.'
        });
      }
    }

    // Mettre à jour
    await attendance.update({
      clock_in: clock_in || attendance.clock_in,
      clock_out: clock_out || attendance.clock_out,
      modified_by: req.user.id,
      modification_reason: reason
    });

    res.json({
      message: 'Pointage modifié avec succès',
      attendance
    });
  } catch (error) {
    next(error);
  }
};

