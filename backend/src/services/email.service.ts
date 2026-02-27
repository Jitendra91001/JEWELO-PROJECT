import nodemailer from "nodemailer";
import { config } from "../config/config";
import { EmailOptions } from "../types";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: config.smtp.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
): Promise<void> => {
  const verificationUrl = `${config.baseUrl}/api/v1/auth/verify-email?token=${verificationToken}`;

  const htmlContent = `
    <h2>Email Verification</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>Link expires in 24 hours.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Email Verification",
    html: htmlContent,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${config.baseUrl}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password. Click the link below:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link expires in 30 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset Request",
    html: htmlContent,
  });
};

export const sendWelcomeEmail = async (
  email: string,
  firstName: string,
): Promise<void> => {
  const htmlContent = `
    <h2>Welcome to Jewelry Store!</h2>
    <p>Hi ${firstName},</p>
    <p>Thank you for registering with us. We're excited to have you on board.</p>
    <p>Browse our collection of beautiful jewelry pieces.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Welcome to Jewelry Store",
    html: htmlContent,
  });
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  total: number,
): Promise<void> => {
  const htmlContent = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
    <p>You will receive a shipping confirmation email soon.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Order Confirmation",
    html: htmlContent,
  });
};
