const { ContactMessage } = require('../models');

const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received by the SkillMate team.',
      contactId: contact._id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact
};
