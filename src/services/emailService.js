const nodemailer = require('nodemailer');

class EmailService {
  static async sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ahmadhamdan47@gmail.com',
        pass: 'pmst fuqf nnhd jioy',
      },
    });

    const mailOptions = {
      from: 'ahmadhamdan47@gmail.com',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;