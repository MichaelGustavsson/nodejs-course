import sgMail from '@sendgrid/mail';

const apiKey = '<Ange er egen SendGrid nyckel här>';

sgMail.setApiKey(apiKey);
console.log(apiKey);
export const sendEmail = async (options) => {
  try {
    console.log('OPTIONS', options);
    const mail = {
      to: options.recipient,
      from: 'michael.gustavsson@skaftoskorpan.se',
      subject: options.subject,
      text: options.message,
      // html: '<h1></h1>'
    };

    const response = await sgMail.send(mail);
    console.log('RESPONSE', response);
  } catch (error) {
    throw new Error(error);
  }
};
