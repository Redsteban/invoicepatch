// Email template utilities for InvoicePatch
// All templates use inline CSS for maximum compatibility

export interface InvoiceEmailData {
  recipientName?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  total: string;
  downloadUrl: string;
  supportEmail: string;
  companyName: string;
  companyAddress: string;
  companyLogoUrl?: string;
  privacyPolicyUrl: string;
  unsubscribeUrl: string;
}

export interface WelcomeEmailData {
  firstName?: string;
  companyName: string;
  supportEmail: string;
  resourcesUrl: string;
  updatesUrl: string;
  privacyPolicyUrl: string;
  unsubscribeUrl: string;
  companyLogoUrl?: string;
  socialLinks?: { name: string; url: string; iconUrl?: string }[];
}

// --- Footer ---
export function getEmailFooter(companyName = 'InvoicePatch', privacyPolicyUrl = '#', unsubscribeUrl = '#', supportEmail = 'support@invoicepatch.com') {
  return `
    <tr>
      <td style="padding: 24px 0 0 0; text-align: center; font-size: 12px; color: #888;">
        <div style="margin-bottom: 8px;">
          <a href="${privacyPolicyUrl}" style="color: #667eea; text-decoration: underline;">Privacy Policy</a> |
          <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: underline;">Unsubscribe</a>
        </div>
        <div style="margin-bottom: 8px;">
          ${companyName} &bull; <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: underline;">${supportEmail}</a>
        </div>
        <div style="color: #aaa; font-size: 11px;">
          You are receiving this email because you opted in via InvoicePatch. <br/>
          &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.<br/>
          This email is intended for the recipient only. For tax and legal information, consult your local regulations.
        </div>
        <div style="color: #aaa; font-size: 10px; margin-top: 8px;">
          To comply with CAN-SPAM and GDPR, you may manage your preferences or unsubscribe at any time.
        </div>
      </td>
    </tr>
  `;
}

// --- Invoice Email Template ---
export function createInvoiceEmailTemplate(data: InvoiceEmailData): string {
  return `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Invoice from ${data.companyName}</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f6fb; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb; min-height:100vh;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; margin:32px 0; max-width:100%;">
            <tr>
              <td style="background:linear-gradient(90deg,#667eea 60%,#764ba2 100%); padding:32px 24px 16px 24px; border-radius:12px 12px 0 0; text-align:left;">
                <!-- Logo Placeholder -->
                <img src="${data.companyLogoUrl || 'https://placehold.co/120x40?text=Logo'}" alt="${data.companyName} Logo" style="height:40px; margin-bottom:12px;" />
                <div style="color:#fff; font-size:2rem; font-weight:bold; letter-spacing:1px;">${data.companyName}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px 16px 24px;">
                <h2 style="color:#667eea; margin:0 0 8px 0; font-size:1.5rem;">Your Invoice is Ready</h2>
                <p style="margin:0 0 16px 0; color:#333; font-size:1.1rem;">${data.recipientName ? `Hi ${data.recipientName},<br/>` : ''}Thank you for using <b>${data.companyName}</b>. Your invoice is attached and ready for download.</p>
                <table cellpadding="0" cellspacing="0" style="width:100%; margin:24px 0; border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0; color:#888;">Invoice #</td>
                    <td style="padding:8px 0; color:#333; font-weight:600;">${data.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; color:#888;">Invoice Date</td>
                    <td style="padding:8px 0; color:#333;">${data.invoiceDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; color:#888;">Due Date</td>
                    <td style="padding:8px 0; color:#333;">${data.dueDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; color:#888;">Total</td>
                    <td style="padding:8px 0; color:#667eea; font-size:1.2rem; font-weight:bold;">${data.total}</td>
                  </tr>
                </table>
                <a href="${data.downloadUrl}" style="display:inline-block; background:#667eea; color:#fff; padding:14px 36px; border-radius:6px; font-weight:600; font-size:1.1rem; text-decoration:none; margin:24px 0 16px 0;">Download Invoice PDF</a>
                <p style="margin:16px 0 0 0; color:#333;">If you have any questions, please contact us at <a href="mailto:${data.supportEmail}" style="color:#667eea; text-decoration:underline;">${data.supportEmail}</a>.</p>
                <p style="margin:8px 0 0 0; color:#888; font-size:0.95rem;">${data.companyAddress}</p>
              </td>
            </tr>
            ${getEmailFooter(data.companyName, data.privacyPolicyUrl, data.unsubscribeUrl, data.supportEmail)}
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// --- Welcome Email Template ---
export function createWelcomeEmailTemplate(data: WelcomeEmailData): string {
  return `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to ${data.companyName}!</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f6fb; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb; min-height:100vh;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; margin:32px 0; max-width:100%;">
            <tr>
              <td style="background:linear-gradient(90deg,#667eea 60%,#764ba2 100%); padding:32px 24px 16px 24px; border-radius:12px 12px 0 0; text-align:left;">
                <!-- Logo Placeholder -->
                <img src="${data.companyLogoUrl || 'https://placehold.co/120x40?text=Logo'}" alt="${data.companyName} Logo" style="height:40px; margin-bottom:12px;" />
                <div style="color:#fff; font-size:2rem; font-weight:bold; letter-spacing:1px;">${data.companyName}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px 16px 24px;">
                <h2 style="color:#667eea; margin:0 0 8px 0; font-size:1.5rem;">Welcome${data.firstName ? `, ${data.firstName}` : ''}!</h2>
                <p style="margin:0 0 16px 0; color:#333; font-size:1.1rem;">We're excited to have you at <b>${data.companyName}</b>. Here are some resources to help you get started:</p>
                <ul style="margin:0 0 16px 20px; color:#333; font-size:1rem;">
                  <li><a href="${data.resourcesUrl}" style="color:#667eea; text-decoration:underline;">Getting Started Guide</a></li>
                  <li><a href="${data.updatesUrl}" style="color:#667eea; text-decoration:underline;">Product Updates</a></li>
                </ul>
                <div style="margin:24px 0;">
                  <a href="${data.resourcesUrl}" style="display:inline-block; background:#667eea; color:#fff; padding:14px 36px; border-radius:6px; font-weight:600; font-size:1.1rem; text-decoration:none;">Explore Resources</a>
                </div>
                <p style="margin:16px 0 0 0; color:#333;">If you have any questions, reply to this email or contact us at <a href="mailto:${data.supportEmail}" style="color:#667eea; text-decoration:underline;">${data.supportEmail}</a>.</p>
                <div style="margin:24px 0 0 0;">
                  <span style="color:#888; font-size:0.95rem;">Follow us:</span>
                  ${data.socialLinks && data.socialLinks.length > 0 ? data.socialLinks.map(link => `<a href="${link.url}" style="margin:0 8px; color:#764ba2; text-decoration:none;"><img src="${link.iconUrl || 'https://placehold.co/24x24?text=SM'}" alt="${link.name}" style="height:24px; vertical-align:middle;" /></a>`).join('') : ''}
                </div>
                <div style="margin:24px 0 0 0; color:#888; font-size:0.95rem;">
                  Manage your <a href="${data.unsubscribeUrl}" style="color:#667eea; text-decoration:underline;">email preferences</a> or <a href="${data.unsubscribeUrl}" style="color:#667eea; text-decoration:underline;">unsubscribe</a> at any time.
                </div>
              </td>
            </tr>
            ${getEmailFooter(data.companyName, data.privacyPolicyUrl, data.unsubscribeUrl, data.supportEmail)}
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// --- Unsubscribe Email Template ---
export function createUnsubscribeEmailTemplate(): string {
  return `
  <html>
  <body style="margin:0; padding:0; background:#f4f6fb; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb; min-height:100vh;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; margin:32px 0; max-width:100%;">
            <tr>
              <td style="background:linear-gradient(90deg,#667eea 60%,#764ba2 100%); padding:32px 24px 16px 24px; border-radius:12px 12px 0 0; text-align:left; color:#fff; font-size:2rem; font-weight:bold; letter-spacing:1px;">
                InvoicePatch
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px 16px 24px;">
                <h2 style="color:#667eea; margin:0 0 8px 0; font-size:1.5rem;">You have been unsubscribed</h2>
                <p style="margin:0 0 16px 0; color:#333; font-size:1.1rem;">You will no longer receive emails from InvoicePatch. If this was a mistake, you can <a href="#" style="color:#667eea; text-decoration:underline;">resubscribe here</a>.</p>
              </td>
            </tr>
            ${getEmailFooter()}
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// --- Preview Utility ---
export function previewEmailTemplate(html: string): void {
  // For development: open a new window with the HTML for preview
  if (typeof window !== 'undefined') {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }
} 