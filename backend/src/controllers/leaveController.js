const { Leave, LeaveType, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// Créer une demande de congé
exports.createLeave = async (req, res, next) => {
  try {
    const { leave_type_id, start_date, end_date, reason, attachments } = req.body;
    const userId = req.user.id;

    // Vérifier que les dates sont valides
    const start = moment(start_date);
    const end = moment(end_date);

    if (end.isBefore(start)) {
      return res.status(400).json({
        error: 'La date de fin doit être après la date de début.'
      });
    }

    // Calculer le nombre de jours
    const totalDays = end.diff(start, 'days') + 1;

    // Vérifier le solde de congés
    if (req.user.leave_balance < totalDays) {
      return res.status(400).json({
        error: `Solde insuffisant. Vous avez ${req.user.leave_balance} jour(s) disponible(s).`
      });
    }

    // Vérifier les chevauchements
    const overlap = await Leave.findOne({
      where: {
        user_id: userId,
        status: { [Op.in]: ['pending', 'approved'] },
        [Op.or]: [
          {
            start_date: { [Op.between]: [start_date, end_date] }
          },
          {
            end_date: { [Op.between]: [start_date, end_date] }
          },
          {
            [Op.and]: [
              { start_date: { [Op.lte]: start_date } },
              { end_date: { [Op.gte]: end_date } }
            ]
          }
        ]
      }
    });

    if (overlap) {
      return res.status(400).json({
        error: 'Vous avez déjà une demande de congé pour cette période.'
      });
    }

    // Créer la demande
    const leave = await Leave.create({
      user_id: userId,
      leave_type_id,
      start_date,
      end_date,
      total_days: totalDays,
      reason,
      attachments: attachments || [],
      status: 'pending'
    });

    res.status(201).json({
      message: 'Demande de congé créée avec succès',
      leave
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir mes demandes de congés
exports.getMyLeaves = async (req, res, next) => {
  try {
    const { status, year } = req.query;
    const userId = req.user.id;

    const where = { user_id: userId };

    if (status) {
      where.status = status;
    }

    if (year) {
      where.start_date = {
        [Op.gte]: `${year}-01-01`,
        [Op.lte]: `${year}-12-31`
      };
    }

    const leaves = await Leave.findAll({
      where,
      include: [
        { model: LeaveType, as: 'leaveType' },
        { 
          model: User, 
          as: 'approver',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      leaves,
      leave_balance: req.user.leave_balance
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les demandes de l'équipe (pour managers)
exports.getTeamLeaves = async (req, res, next) => {
  try {
    const { status } = req.query;

    let userWhere = {};

    if (req.user.role === 'manager') {
      userWhere.manager_id = req.user.id;
    } else if (req.user.role === 'admin') {
      userWhere.company_id = req.user.company_id;
    }

    const where = {};
    if (status) {
      where.status = status;
    }

    const leaves = await Leave.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          where: userWhere,
          attributes: ['id', 'first_name', 'last_name', 'employee_code', 'job_title']
        },
        { model: LeaveType, as: 'leaveType' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ leaves });
  } catch (error) {
    next(error);
  }
};

// Approuver ou refuser une demande de congé
exports.reviewLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Statut invalide. Utilisez "approved" ou "rejected".'
      });
    }

    const leave = await Leave.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!leave) {
      return res.status(404).json({
        error: 'Demande de congé non trouvée.'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        error: 'Cette demande a déjà été traitée.'
      });
    }

    // Vérifier les permissions
    if (req.user.role === 'manager' && leave.user.manager_id !== req.user.id) {
      return res.status(403).json({
        error: 'Vous ne pouvez traiter que les demandes de votre équipe.'
      });
    }

    // Mettre à jour la demande
    await leave.update({
      status,
      approved_by: req.user.id,
      approved_at: new Date(),
      rejection_reason: status === 'rejected' ? rejection_reason : null
    });

    // Si approuvé, déduire du solde de congés
    if (status === 'approved') {
      const user = await User.findByPk(leave.user_id);
      await user.update({
        leave_balance: user.leave_balance - leave.total_days
      });
    }

    res.json({
      message: status === 'approved' ? 'Demande approuvée' : 'Demande refusée',
      leave
    });
  } catch (error) {
    next(error);
  }
};

// Annuler une demande de congé
exports.cancelLeave = async (req, res, next) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findByPk(id);

    if (!leave) {
      return res.status(404).json({
        error: 'Demande de congé non trouvée.'
      });
    }

    // Seul l'utilisateur peut annuler sa propre demande
    if (leave.user_id !== req.user.id) {
      return res.status(403).json({
        error: 'Vous ne pouvez annuler que vos propres demandes.'
      });
    }

    if (!['pending', 'approved'].includes(leave.status)) {
      return res.status(400).json({
        error: 'Cette demande ne peut plus être annulée.'
      });
    }

    // Si déjà approuvé, recréditer le solde
    if (leave.status === 'approved') {
      await req.user.update({
        leave_balance: req.user.leave_balance + leave.total_days
      });
    }

    await leave.update({ status: 'cancelled' });

    res.json({
      message: 'Demande annulée avec succès',
      leave
    });
  } catch (error) {
    next(error);
  }
};

