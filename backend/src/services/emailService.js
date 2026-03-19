import nodemailer from 'nodemailer';

const EMAIL_SUBJECT = 'Your Trading Journal Pro+ Login OTP';

const createTransporter = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Missing email credentials. Set EMAIL_USER and EMAIL_PASS in backend/.env');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

export const sendLoginOtpEmail = async ({ to, otp }) => {
  const transporter = createTransporter();

  const text = `Your OTP is ${otp}. It expires in 5 minutes.`;
  const html = `
    <div style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#0f172a;padding:20px 24px;">
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#fbbf24;">Trading Journal Pro+</h1>
          <p style="margin:8px 0 0 0;color:#cbd5e1;font-size:13px;">Secure Login Verification</p>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 14px 0;font-size:15px;">Use this one-time code to complete your sign in:</p>
          <div style="margin:16px 0;padding:16px;background:#111827;border-radius:10px;text-align:center;">
            <span style="font-size:34px;letter-spacing:8px;color:#f9fafb;font-weight:700;">${otp}</span>
          </div>
          <p style="margin:0 0 12px 0;font-size:14px;color:#374151;">This OTP expires in <strong>5 minutes</strong> and can be used only once.</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">If this login wasn't you, please change your password immediately and review your account activity.</p>
        </div>
      </div>
      <p style="max-width:560px;margin:12px auto 0 auto;font-size:11px;color:#6b7280;text-align:center;">This is an automated security message from Trading Journal Pro+.</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Trading Journal Pro+ Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: EMAIL_SUBJECT,
    text,
    html,
  });

  return { delivered: true, messageId: info.messageId };
};
