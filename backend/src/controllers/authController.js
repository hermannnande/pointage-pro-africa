const jwt = require('jsonwebtoken');
const { User, Company, Site } = require('../models');
const { Op } = require('sequelize');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Inscription (pour admin qui crée des employés)
exports.register = async (req, res, next) => {
  try {
    const {
      company_id,
      site_id,
      department_id,
      manager_id,
      employee_code,
      first_name,
      last_name,
      email,
      phone,
      password,
      pin_code,
      role,
      job_title,
      contract_type
    } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { employee_code },
          ...(email ? [{ email }] : []),
          { phone }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Un utilisateur avec ce code employé, email ou téléphone existe déjà.'
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      company_id,
      site_id,
      department_id,
      manager_id,
      employee_code,
      first_name,
      last_name,
      email,
      phone,
      password,
      pin_code,
      role: role || 'employee',
      job_title,
      contract_type: contract_type || 'cdi',
      is_active: true
    });

    // Générer le token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

// Connexion
exports.login = async (req, res, next) => {
  try {
    const { identifier, password, pin_code } = req.body;

    // Chercher l'utilisateur par email, téléphone ou code employé
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phone: identifier },
          { employee_code: identifier }
        ],
        is_active: true
      },
      include: [
        { model: Company, as: 'company' },
        { model: Site, as: 'site' }
      ]
    });

    if (!user) {
      return res.status(401).json({
        error: 'Identifiants incorrects.'
      });
    }

    // Vérifier le mot de passe ou le PIN
    let isValid = false;
    
    if (password) {
      isValid = await user.comparePassword(password);
    } else if (pin_code) {
      isValid = await user.comparePinCode(pin_code);
    }

    if (!isValid) {
      return res.status(401).json({
        error: 'Identifiants incorrects.'
      });
    }

    // Mettre à jour la dernière connexion
    await user.update({ last_login: new Date() });

    // Générer le token
    const token = generateToken(user.id);

    // Retourner les infos utilisateur sans le mot de passe
    const userResponse = user.toJSON();

    res.json({
      message: 'Connexion réussie',
      user: userResponse,
      token
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Company, as: 'company' },
        { model: Site, as: 'site' },
        { model: User, as: 'manager', attributes: ['id', 'first_name', 'last_name', 'job_title'] }
      ]
    });

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      avatar_url,
      settings
    } = req.body;

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (avatar_url) updateData.avatar_url = avatar_url;
    if (settings) updateData.settings = settings;

    await req.user.update(updateData);

    res.json({
      message: 'Profil mis à jour',
      user: req.user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    // Vérifier le mot de passe actuel
    const isValid = await req.user.comparePassword(current_password);
    if (!isValid) {
      return res.status(401).json({
        error: 'Mot de passe actuel incorrect.'
      });
    }

    // Mettre à jour le mot de passe
    await req.user.update({ password: new_password });

    res.json({
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Enregistrer le token de notification push
exports.registerDeviceToken = async (req, res, next) => {
  try {
    const { device_token, platform } = req.body;

    if (!device_token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    // Ajouter le token à la liste des tokens de l'utilisateur
    const tokens = req.user.device_tokens || [];
    
    // Éviter les doublons
    const existingToken = tokens.find(t => t.token === device_token);
    if (!existingToken) {
      tokens.push({
        token: device_token,
        platform: platform || 'unknown',
        registered_at: new Date()
      });
    }

    await req.user.update({ device_tokens: tokens });

    res.json({
      message: 'Token enregistré avec succès'
    });
  } catch (error) {
    next(error);
  }
};

