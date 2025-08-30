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

  static async sendEmailWithCC(to, cc, subject, text) {
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
      cc,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendEmailWithHTML(to, subject, html, cc = null) {
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
      html,
    };

    if (cc) {
      mailOptions.cc = cc;
    }

    await transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;