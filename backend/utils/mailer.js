const nodemailer = require('nodemailer');

// Use Ethereal for development/testing
async function createTestAccountAndTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return { transporter, testAccount };
}

let transporter, testAccount;
(async () => {
  const result = await createTestAccountAndTransporter();
  transporter = result.transporter;
  testAccount = result.testAccount;
  transporter.verify(function(error, success) {
    if (error) {
      console.error('Nodemailer verification failed:', error);
    } else {
      console.log('Nodemailer is ready to send emails (Ethereal)');
      console.log('Ethereal test account:', testAccount.user);
    }
  });
})();

// Send email function
async function sendShareNotification(to, fromName, taskTitle) {
  const mailOptions = {
    from: testAccount ? testAccount.user : 'test@ethereal.email',
    to,
    subject: `Task Shared With You on TaskShare!`,
    text: `${fromName} has shared a task with you: "${taskTitle}". Log in to TaskShare to view it!`,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
}

module.exports = sendShareNotification;
