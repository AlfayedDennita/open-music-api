const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  sendEmail(targetEmail, content, options) {
    const { userFullName, playlistName } = options;

    const message = {
      from: 'OpenMusic',
      to: targetEmail,
      subject: `Ekspor Lagu pada Playlist ${playlistName}`,
      text: `Halo ${userFullName}, kami sudah melampirkan file JSON yang berisi daftar lagu dalam playlist ${playlistName}.`,
      attachments: [
        {
          filename: 'playlistsongs.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
