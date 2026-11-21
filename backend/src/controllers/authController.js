const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../utils/token');

// 1. Student Registration (Public registration is restricted to STUDENT role)
const register = async (req, res, next) => {
  try {
    const { name, email, password, education, college, interests } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address is already registered.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'STUDENT',
      education: education || null,
      college: college || null,
      interests: interests || null,
      is_active: true
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully. Welcome to SkillMate!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        education: newUser.education,
        college: newUser.college,
        interests: newUser.interests,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. User Login (Role-aware)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        education: user.education,
        college: user.college,
        interests: user.interests,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Current User Profile (me)
const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, education, college, interests } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.name = name || user.name;
    user.education = education !== undefined ? education : user.education;
    user.college = college !== undefined ? college : user.college;
    user.interests = interests !== undefined ? interests : user.interests;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        education: user.education,
        college: user.college,
        interests: user.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

// 5. Change Password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'The current password you entered is incorrect.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please keep your credentials secure.'
    });
  } catch (error) {
    next(error);
  }
};

// 6. Forgot Password Request
const forgotPassword = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'If an active account exists for this email, password reset instructions have been logged. In development mode, please contact the administrator or use your registered credentials.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword
};
