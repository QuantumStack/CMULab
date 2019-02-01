const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.CMULAB_SMTP_SERVER,
  port: process.env.CMULAB_SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.CMULAB_SMTP_USER,
    pass: process.env.CMULAB_SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

module.exports = transporter;
