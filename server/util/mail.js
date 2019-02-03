const nodemailer = require('nodemailer');

// create nodemailer transport using settings from .env
const transporter = nodemailer.createTransport({
  host: process.env.CMULAB_SMTP_SERVER,
  port: process.env.CMULAB_SMTP_PORT,
  secure: false, // TODO: upgrade later with STARTTLS
  auth: {
    user: process.env.CMULAB_SMTP_USER,
    pass: process.env.CMULAB_SMTP_PASS,
  },
});

// make sure the mail transport works
transporter.verify((error) => {
  if (error) console.error(error);
  else console.log('Server is ready to take our messages');
});

module.exports = transporter;
