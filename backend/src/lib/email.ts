import nodemailer from "nodemailer";

// Retrieve SMTP settings from env
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM ?? "no-reply@ciisic.in";

let transporter: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for others
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        text,
        html,
      });
      console.log(`[Email] Message sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[Email] Failed to send email to ${to}:`, error);
      throw error;
    }
  } else {
    // In development or when SMTP is not configured, print to the console
    console.log(`
============================================================
[MOCK EMAIL SENT]
To:      ${to}
Subject: ${subject}
Text:    ${text}
============================================================
    `);
    return { mock: true, messageId: "mock-id-" + Date.now() };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  const subject = "Reset your CIISIC Password";
  const text = `Hello ${name},\n\nYou requested a password reset. Please use the following link to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested a password reset for your CIISIC platform account.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="margin: 20px 0;">
        <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; color: #64748b;">${resetUrl}</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">This link will expire in 1 hour. If you did not make this request, you can safely ignore this email.</p>
    </div>
  `;
  return sendEmail({ to, subject, html, text });
}

export async function sendProposalStatusEmail(
  to: string,
  name: string,
  status: string,
  challengeTitle: string,
  revisionNotes?: string | null
) {
  const subject = `CIISIC Proposal Status Updated: ${status.replace(/_/g, " ")}`;
  
  let noteText = "";
  let noteHtml = "";
  
  if (status === "REVISION_REQUESTED" && revisionNotes) {
    noteText = `\n\nRevision notes from reviewer:\n${revisionNotes}`;
    noteHtml = `
      <div style="background-color: #fef08a; border-left: 4px solid #eab308; padding: 15px; margin: 15px 0; border-radius: 4px;">
        <h4 style="margin: 0 0 10px 0; color: #854d0e;">Revision Required:</h4>
        <p style="margin: 0; color: #713f12;">${revisionNotes}</p>
      </div>
    `;
  }

  const text = `Hello ${name},\n\nThe status of your proposal for the challenge "${challengeTitle}" has been updated to ${status}.${noteText}\n\nPlease log in to the portal to view details.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Proposal Status Update</h2>
      <p>Hello ${name},</p>
      <p>The status of your proposal for the challenge <strong>"${challengeTitle}"</strong> has been updated to:</p>
      <div style="margin: 15px 0;">
        <span style="font-size: 16px; font-weight: bold; background-color: #e2e8f0; padding: 6px 12px; border-radius: 4px; display: inline-block;">${status.replace(/_/g, " ")}</span>
      </div>
      ${noteHtml}
      <p>Please log in to the CIISIC portal to check the updates and continue the process.</p>
    </div>
  `;
  return sendEmail({ to, subject, html, text });
}
