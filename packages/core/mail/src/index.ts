// ============================================================
// @breeyard/mail — transactional email via Nodemailer/SMTP
// Ported and adapted from @artist-platform/mail
// BOUNDARY: all outbound email I/O is here. Never import nodemailer directly.
// ============================================================

import nodemailer from 'nodemailer';
import type { Transporter, SendMailOptions as NodemailerSendOptions } from 'nodemailer';

// ---- Types ----

export interface MailConfig {
  readonly host: string;
  readonly port: number;
  /** true = SSL (port 465), false = STARTTLS (port 587), omit for local dev (port 1025) */
  readonly secure: boolean;
  readonly auth: {
    readonly user: string;
    readonly pass: string;
  };
  /** From address, e.g. "Bree Yard <hello@breeyard.dev>" */
  readonly from: string;
}

export interface MailMessage {
  readonly to: string | readonly string[];
  readonly subject: string;
  readonly html: string;
  readonly text: string;
  readonly replyTo?: string;
}

export interface MailResult {
  readonly messageId: string;
  readonly accepted: readonly string[];
  readonly rejected: readonly string[];
}

export interface MailClient {
  readonly send: (message: MailMessage) => Promise<MailResult>;
  readonly sendWelcome: (
    to: string,
    options: { readonly name: string; readonly loginUrl: string },
  ) => Promise<MailResult>;
  readonly sendPasswordReset: (
    to: string,
    options: { readonly resetUrl: string; readonly expiresInMinutes?: number },
  ) => Promise<MailResult>;
  readonly sendProjectUpdate: (
    to: string,
    options: {
      readonly projectName: string;
      readonly message: string;
      readonly dashboardUrl: string;
    },
  ) => Promise<MailResult>;
  readonly verify: () => Promise<boolean>;
}

// ---- Internal helpers ----

const toMailResult = (info: {
  messageId: string;
  accepted: unknown[];
  rejected: unknown[];
}): MailResult => ({
  messageId: info.messageId,
  accepted: info.accepted.map(String),
  rejected: info.rejected.map(String),
});

const welcomeHtml = (name: string, loginUrl: string): string =>
  `<p>Hi ${name},</p>
<p>Your account is ready. Click below to sign in.</p>
<p><a href="${loginUrl}" style="font-size:16px;font-weight:bold;">Sign in</a></p>`;

const welcomeText = (name: string, loginUrl: string): string =>
  `Hi ${name},\n\nYour account is ready.\n\nSign in: ${loginUrl}`;

const passwordResetHtml = (resetUrl: string, expiresInMinutes: number): string =>
  `<p>You requested a password reset. This link expires in ${String(expiresInMinutes)} minutes.</p>
<p><a href="${resetUrl}" style="font-size:16px;font-weight:bold;">Reset password</a></p>
<p>If you did not request this, you can safely ignore this email.</p>`;

const passwordResetText = (resetUrl: string, expiresInMinutes: number): string =>
  `You requested a password reset (expires in ${String(expiresInMinutes)} minutes):\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`;

const projectUpdateHtml = (projectName: string, message: string, dashboardUrl: string): string =>
  `<p>Update on <strong>${projectName}</strong>:</p>
<p>${message}</p>
<p><a href="${dashboardUrl}">View in dashboard</a></p>`;

const projectUpdateText = (projectName: string, message: string, dashboardUrl: string): string =>
  `Update on ${projectName}:\n\n${message}\n\nView in dashboard: ${dashboardUrl}`;

// ---- Factory ----

export const createMailClient = (config: MailConfig, transport?: Transporter): MailClient => {
  // BOUNDARY: Nodemailer transport creation.
  const transporter: Transporter =
    transport ??
    nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

  const send = async (message: MailMessage): Promise<MailResult> => {
    const options: NodemailerSendOptions = {
      from: config.from,
      to: Array.isArray(message.to)
        ? [...(message.to as string[])].join(', ')
        : (message.to as string),
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.replyTo ? { replyTo: message.replyTo } : {}),
    };
    // BOUNDARY: SMTP send.
    const info = await transporter.sendMail(options);

    return toMailResult(info as { messageId: string; accepted: unknown[]; rejected: unknown[] });
  };

  const sendWelcome = (
    to: string,
    { name, loginUrl }: { name: string; loginUrl: string },
  ): Promise<MailResult> =>
    send({
      to,
      subject: 'Welcome — your account is ready',
      html: welcomeHtml(name, loginUrl),
      text: welcomeText(name, loginUrl),
    });

  const sendPasswordReset = (
    to: string,
    { resetUrl, expiresInMinutes = 30 }: { resetUrl: string; expiresInMinutes?: number },
  ): Promise<MailResult> =>
    send({
      to,
      subject: 'Reset your password',
      html: passwordResetHtml(resetUrl, expiresInMinutes),
      text: passwordResetText(resetUrl, expiresInMinutes),
    });

  const sendProjectUpdate = (
    to: string,
    {
      projectName,
      message,
      dashboardUrl,
    }: { projectName: string; message: string; dashboardUrl: string },
  ): Promise<MailResult> =>
    send({
      to,
      subject: `Update on ${projectName}`,
      html: projectUpdateHtml(projectName, message, dashboardUrl),
      text: projectUpdateText(projectName, message, dashboardUrl),
    });

  // BOUNDARY: SMTP verify.
  const verify = (): Promise<boolean> =>
    transporter
      .verify()
      .then(() => true)
      .catch(() => false);

  return { send, sendWelcome, sendPasswordReset, sendProjectUpdate, verify };
};

// ---- Default singleton (reads from env) ----

let _mailClient: MailClient | null = null;

export const getMailClient = (): MailClient => {
  _mailClient ??= createMailClient({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '1026', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    },
    from: process.env.MAIL_FROM ?? 'noreply@breeyard.dev',
  });
  return _mailClient;
};
