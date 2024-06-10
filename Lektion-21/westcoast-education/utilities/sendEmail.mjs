import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_SENDER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Westcoast Education" <${process.env.SMTP_SENDER}>`,
      to: options.recipient,
      subject: options.subject,
      text: 'Hoppas det funkar',
    });
  } catch (error) {
    throw new Error(`Det inte att skicka e-post felmeddelande: ${error}`);
  }
};
