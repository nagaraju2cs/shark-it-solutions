const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send email utility
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`Email error: ${err.message}`);
    throw err;
  }
};

// ── Email Templates ────────────────────────────

const contactConfirmationTemplate = (name, service) => `
<!DOCTYPE html>
<html>
<body style="font-family:'Nunito',Arial,sans-serif;background:#f0f7ff;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,100,200,0.1);">
    <div style="background:#0d2a45;padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:2px;">🦈 SHARK IT SOLUTIONS</h1>
      <p style="color:#7aaccc;margin:8px 0 0;font-size:13px;letter-spacing:1px;">PREDATOR-CLASS TECHNOLOGY</p>
    </div>
    <div style="padding:36px;">
      <h2 style="color:#0d2a45;margin-top:0;">Thank you, ${name}! 👋</h2>
      <p style="color:#3a6080;line-height:1.8;">We've received your enquiry about <strong style="color:#0077cc;">${service}</strong> services.</p>
      <p style="color:#3a6080;line-height:1.8;">Our team will review your requirements and get back to you within <strong>24 hours</strong>.</p>
      <div style="background:#e0f0ff;border-left:4px solid #0077cc;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
        <p style="margin:0;color:#0d2a45;font-size:14px;"><strong>What happens next?</strong></p>
        <ul style="color:#3a6080;margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.8;">
          <li>A dedicated account manager will be assigned to you</li>
          <li>We'll schedule a free 30-minute discovery call</li>
          <li>You'll receive a custom proposal within 48 hours</li>
        </ul>
      </div>
      <div style="text-align:center;margin-top:28px;">
        <a href="https://www.linkedin.com/in/shark-itsolutions-4b52a3256" style="background:#0077cc;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-size:14px;letter-spacing:1px;">Connect on LinkedIn →</a>
      </div>
    </div>
    <div style="background:#f0f7ff;padding:20px;text-align:center;border-top:1px solid #bdd8f0;">
      <p style="color:#4a7a9b;font-size:12px;margin:0;">Hyderabad, Telangana, India | info@sharkitsolutions.com</p>
    </div>
  </div>
</body>
</html>`;

const adminNotificationTemplate = (data) => `
<!DOCTYPE html>
<html>
<body style="font-family:'Nunito',Arial,sans-serif;background:#f0f7ff;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,100,200,0.1);">
    <div style="background:#0d2a45;padding:24px 32px;">
      <h2 style="color:#ffffff;margin:0;">🔔 New Contact Form Submission</h2>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;color:#4a7a9b;font-size:13px;width:140px;font-weight:600;">Name</td><td style="padding:10px 0;color:#0d2a45;">${data.name}</td></tr>
        <tr style="background:#f8fcff;"><td style="padding:10px;color:#4a7a9b;font-size:13px;font-weight:600;">Email</td><td style="padding:10px;color:#0d2a45;">${data.email}</td></tr>
        <tr><td style="padding:10px 0;color:#4a7a9b;font-size:13px;font-weight:600;">Phone</td><td style="padding:10px 0;color:#0d2a45;">${data.phone || 'Not provided'}</td></tr>
        <tr style="background:#f8fcff;"><td style="padding:10px;color:#4a7a9b;font-size:13px;font-weight:600;">Service</td><td style="padding:10px;"><span style="background:#e0f0ff;color:#0077cc;padding:3px 10px;border-radius:4px;font-size:13px;">${data.service}</span></td></tr>
        <tr><td style="padding:10px 0;color:#4a7a9b;font-size:13px;font-weight:600;">Message</td><td style="padding:10px 0;color:#0d2a45;line-height:1.7;">${data.message}</td></tr>
        <tr style="background:#f8fcff;"><td style="padding:10px;color:#4a7a9b;font-size:13px;font-weight:600;">Submitted At</td><td style="padding:10px;color:#0d2a45;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`;

module.exports = { sendEmail, contactConfirmationTemplate, adminNotificationTemplate };
