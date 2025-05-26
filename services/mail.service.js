const nodemailer = require("nodemailer");
const config = require("config");
const recipient = config.get("smtp_recipient");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendMail(recipient, link) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: config.get("smtp_recipient"),
      subject: "ITTERM akkauntini faollashtirish",
      text: "",
      html: `
        <div>
          <h2>Akkauntni faollashtirish uchun quyidagi linkni bosing</h2>
          <a href="${link}">FAOLLASHTIRISH</a>
        </div>
        `,
    });
  }
}

module.exports = new MailService();
