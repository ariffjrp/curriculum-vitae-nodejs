const speakeasy = require('speakeasy');
const MailService = require('./mail.service');

class OTPService {
    static generateSecret() {
        try {
            const secret = speakeasy.generateSecret();
            if (!secret.base32) {
                throw new Error('Base32 secret is undefined');
            }
            return secret.base32; 
        } catch (error) {
            throw new Error('Gagal menghasilkan TOTP: ' + error.message);
        }
    }

    static generateOTP(secret) {
        try {
            const otp = speakeasy.totp({
                secret: secret,
                digits: 6,
                step: 30
            });
            return otp;
        } catch (error) {
            throw new Error('Gagal menghasilkan OTP: ' + error.message);
        }
    }

    static async sendOTPEmail(email, secret) {
        try {
            const otp = this.generateOTP(secret); 

            const subject = 'Your One-Time Password (OTP)';
            const message = `Your OTP is: ${otp}`;

            console.log(email);
            await MailService.sendEmail(email, subject, message);
            return otp; 
        } catch (error) {
            throw new Error('Failed to send OTP email: ' + error.message);
        }
    }
    

    static verifyTOTP(otp, secret) {
        try {
            if (!secret || typeof secret !== 'string') {
                throw new Error('Invalid secret');
            }
    
            const isValid = speakeasy.totp.verify({
                secret: secret,
                token: otp,
                window: 10 
            });
            return isValid;
        } catch (error) {
            throw new Error('Failed to verify TOTP: ' + error.message);
        }
    }
    
}

module.exports = OTPService;
