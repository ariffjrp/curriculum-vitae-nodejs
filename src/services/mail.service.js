require('dotenv').config();
const transports = require("../config/mail.config")
const { logger } = require('../utils/logger.js');

class MailService {
    static  async sendEmail(to, subject, message) {
        try {
            let mail = await transports.sendMail({
                from : process.env.MAIL_USERNAME,
                to : to,
                subject : subject,
                text: message
            })   

            logger.info(`send email to user ${to}, ${subject}, ${message}`);
            return mail;
        } catch (err) {
            logger.error(err.message);
            throw(err);
        }
    }
}

module.exports = MailService;