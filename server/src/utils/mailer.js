const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_SECURE) === "true", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

transporter.verify().then(() => {
  console.log("Email transporter is ready");
}).catch((e) => {
  console.error("Email transporter error:", e?.message || e);
});

function welcomeEmailTemplate({ name, email }) {
  const appName = process.env.APP_NAME || "Ogb Apt";
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const safeName = escapeHtml(name || "there");

  const subject = `Welcome to ${appName}, ${name || "friend"} 🎉`;

  const html = `
  <div style="background:#f6f7fb;padding:24px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eef0f5;">
      <div style="padding:22px 24px;background:linear-gradient(135deg,#0f172a,#4f46e5,#a855f7);color:#fff;">
        <div style="font-size:14px;opacity:.9">${appName}</div>
        <h1 style="margin:10px 0 0;font-size:22px;line-height:1.2;">Welcome, ${safeName} 👋</h1>
        <p style="margin:10px 0 0;opacity:.9;font-size:14px;">
          Your account is ready. You can now browse apartments and book on WhatsApp.
        </p>
      </div>

      <div style="padding:22px 24px;color:#111827;">
        <p style="margin:0 0 14px;font-size:15px;">
          Hi <b>${safeName}</b>, thanks for signing up with <b>${appName}</b>.
        </p>

        <div style="background:#f9fafb;border:1px solid #eef2f7;border-radius:12px;padding:14px 16px;margin:16px 0;">
          <p style="margin:0;font-size:13px;color:#374151;"><b>Account email:</b> ${escapeHtml(email)}</p>
          <p style="margin:8px 0 0;font-size:13px;color:#374151;">
            Tip: Save apartments you like, and they’ll appear in your dashboard favorites.
          </p>
        </div>

        <a href="${appUrl}/apartments"
          style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:600;">
          Browse Apartments
        </a>

        <p style="margin:16px 0 0;font-size:12px;color:#6b7280;">
          If you didn’t create this account, you can ignore this email.
        </p>
      </div>

      <div style="padding:16px 24px;background:#ffffff;border-top:1px solid #eef2f7;color:#6b7280;font-size:12px;">
        © ${new Date().getFullYear()} ${appName}. All rights reserved.
      </div>
    </div>
  </div>
  `;

  const text = `Welcome to ${appName}, ${name || "there"}!
Your account is ready. Browse apartments: ${appUrl}/apartments`;

  return { subject, html, text };
}

async function sendWelcomeEmail({ to, name }) {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const { subject, html, text } = welcomeEmailTemplate({ name, email: to });

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}

module.exports = {
  transporter,
  sendWelcomeEmail,
};