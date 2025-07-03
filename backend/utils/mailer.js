const nodemailer = require('nodemailer');

// Configure transporter (use your email service credentials)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
async function sendShareNotification(to, fromName, taskTitle) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Task Shared With You on TaskShare!`,
    text: `${fromName} has shared a task with you: "${taskTitle}". Log in to TaskShare to view it!`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendShareNotification;
