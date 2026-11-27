import { formatPrice } from './utils';

function escapeHtml(value: string | null | undefined): string {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface BrevoRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
}

/**
 * Core function to send an email via Brevo Transactional Email REST API v3
 */
export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  textContent,
  replyTo,
}: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string; skipped?: boolean }> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn(`[Brevo] BREVO_API_KEY is not configured. Email skipped: "${subject}" to ${to.map((r) => r.email).join(', ')}`);
    return { success: false, skipped: true, error: 'BREVO_API_KEY is not configured' };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'himalifresh@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Himali Fresh';

  try {
    const payload: any = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: to.map((r) => ({
        email: r.email.trim(),
        name: r.name || r.email.split('@')[0],
      })),
      subject,
      htmlContent,
    };

    if (textContent) {
      payload.textContent = textContent;
    }

    if (replyTo) {
      payload.replyTo = replyTo;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Brevo Error]', data);
      return {
        success: false,
        error: data.message || `Brevo API error: ${response.status}`,
      };
    }

    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (err: any) {
    console.error('[Brevo Exception]', err);
    return {
      success: false,
      error: err?.message || 'Network error calling Brevo API',
    };
  }
}

/**
 * Base email layout wrapper with Himali Fresh brand colors
 */
function getEmailLayout(title: string, bodyHtml: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917477768499';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F5F0; margin: 0; padding: 24px; color: #1E293B; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #E2D9C8; }
    .header { background: #064B32; padding: 28px 24px; text-align: center; color: #FFFFFF; }
    .logo-text { font-size: 26px; font-weight: bold; letter-spacing: 0.5px; margin: 0; color: #FFFFFF; }
    .tagline { font-size: 13px; color: #E9BE54; margin-top: 4px; text-transform: uppercase; letter-spacing: 1.5px; }
    .content { padding: 32px 28px; }
    .footer { background: #FAF7F2; padding: 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2D9C8; }
    .btn { display: inline-block; padding: 12px 24px; background: #064B32; color: #FFFFFF !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; margin-top: 16px; }
    .btn-gold { background: #0B6B43; color: #FFFFFF !important; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge-new { background: #FEF3C7; color: #92400E; }
    .badge-confirmed { background: #D1FAE5; color: #065F46; }
    .badge-completed { background: #EDE9FE; color: #5B21B6; }
    .badge-cancelled { background: #FEE2E2; color: #991B1B; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 20px; }
    th { text-align: left; padding: 10px 12px; background: #F8F5F0; font-size: 12px; text-transform: uppercase; color: #475569; border-bottom: 1px solid #E2D9C8; }
    td { padding: 12px; font-size: 14px; border-bottom: 1px solid #F1ECE1; vertical-align: middle; }
    .total-row td { font-weight: bold; font-size: 16px; color: #064B32; border-top: 2px solid #064B32; }
    .info-box { background: #F8F5F0; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #E8DFC8; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">🌿 Himali Fresh</div>
      <div class="tagline">The Spirit of Himalayas</div>
    </div>
    <div class="content">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><strong>Himali Fresh</strong> • Siliguri, West Bengal, India</p>
      <p style="margin: 0 0 10px 0;">Pure and authentic Himalayan food products, pickles, mountain teas, and spices.</p>
      <p style="margin: 0 0 12px 0;">
        <a href="https://wa.me/${whatsappNumber}" style="color: #064B32; text-decoration: underline; margin-right: 8px;">WhatsApp Support</a> • 
        <a href="${appUrl}" style="color: #064B32; text-decoration: underline; margin-right: 8px; margin-left: 8px;">Visit Website</a> •
        <a href="${appUrl}/privacy-policy" style="color: #064B32; text-decoration: underline; margin-left: 8px;">Privacy Policy</a>
      </p>
      <p style="margin: 12px 0 0 0; font-size: 11px; color: #94A3B8; line-height: 1.4;">
        This is a transactional communication related to your order or enquiry. We respect your privacy in accordance with DPDP Act 2023. To manage your communication preferences or request personal data deletion, email <a href="mailto:himalifresh@gmail.com" style="color: #64748B;">himalifresh@gmail.com</a>.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Send Order Confirmation Email to Customer
 */
export async function sendOrderConfirmationEmail(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  totalAmount: number;
  items: Array<{
    productNameSnapshot: string;
    weightSnapshot?: string | null;
    quantity: number;
    unitPriceSnapshot: number;
    subtotal: number;
  }>;
}) {
  const { orderNumber, customerName, customerEmail, phone, address, city, pincode, totalAmount, items } = params;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917477768499';

  const rows = items
    .map(
      (item) => `
      <tr>
        <td>
          <strong>${escapeHtml(item.productNameSnapshot)}</strong>
          ${item.weightSnapshot ? `<br><span style="font-size: 12px; color: #64748B;">Net: ${escapeHtml(item.weightSnapshot)}</span>` : ''}
        </td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatPrice(item.unitPriceSnapshot)}</td>
        <td style="text-align: right; font-weight: 600;">${formatPrice(item.subtotal)}</td>
      </tr>`
    )
    .join('');

  const safeName = escapeHtml(customerName);
  const safePhone = escapeHtml(phone);
  const safeAddress = escapeHtml(address);
  const safeCity = escapeHtml(city);
  const safePincode = escapeHtml(pincode);
  const safeOrderNumber = escapeHtml(orderNumber);

  const bodyHtml = `
    <h2 style="color: #064B32; margin-top: 0;">Order Received, ${safeName}!</h2>
    <p style="font-size: 15px; line-height: 1.5; color: #334155;">
      Thank you for shopping with <strong>Himali Fresh</strong>. We have received your order enquiry <strong>#${safeOrderNumber}</strong>. Our team in Siliguri is reviewing the fresh batch availability and will coordinate your dispatch via WhatsApp.
    </p>

    <div class="info-box">
      <div style="font-weight: bold; color: #064B32; margin-bottom: 6px;">Delivery Details:</div>
      <div><strong>Customer:</strong> ${safeName} (${safePhone})</div>
      <div><strong>Address:</strong> ${safeAddress}, ${safeCity} - ${safePincode}</div>
    </div>

    <h3 style="font-size: 15px; color: #064B32; margin-bottom: 8px;">Order Summary:</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="3" style="text-align: right;">Total Amount:</td>
          <td style="text-align: right;">${formatPrice(totalAmount)}</td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="https://wa.me/${whatsappNumber}?text=Hi%20Himali%20Fresh,%20I%20have%20an%20enquiry%20regarding%20my%20Order%20${orderNumber}" class="btn">
        💬 Chat with us on WhatsApp
      </a>
    </div>
  `;

  return sendBrevoEmail({
    to: [{ email: customerEmail, name: customerName }],
    subject: `Order Received #${orderNumber} | Himali Fresh`,
    htmlContent: getEmailLayout(`Order Confirmation #${orderNumber}`, bodyHtml),
  });
}

/**
 * 2. Send Admin Alert Email for New Orders
 */
export async function sendAdminNewOrderAlert(params: {
  orderNumber: string;
  customerName: string;
  customerEmail?: string | null;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  totalAmount: number;
  adminEmailOverride?: string | null;
  items: Array<{
    productNameSnapshot: string;
    weightSnapshot?: string | null;
    quantity: number;
    unitPriceSnapshot: number;
    subtotal: number;
  }>;
}) {
  const adminEmail = process.env.BREVO_ADMIN_EMAIL || params.adminEmailOverride || process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'himalifresh@gmail.com';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com';

  const { orderNumber, customerName, customerEmail, phone, address, city, pincode, totalAmount, items } = params;

  const rows = items
    .map(
      (item) => `
      <tr>
        <td><strong>${item.productNameSnapshot}</strong> (${item.weightSnapshot || 'Standard'})</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatPrice(item.subtotal)}</td>
      </tr>`
    )
    .join('');

  const bodyHtml = `
    <h2 style="color: #064B32; margin-top: 0;">🛒 New Order Enquiry Received!</h2>
    <p style="font-size: 15px; color: #334155;">
      A customer just placed a new order enquiry on the Himali Fresh store.
    </p>

    <div class="info-box">
      <div><strong>Order Number:</strong> #${orderNumber}</div>
      <div><strong>Customer:</strong> ${customerName}</div>
      <div><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a> | <a href="https://wa.me/${phone.replace(/[^\d]/g, '')}">Open WhatsApp</a></div>
      ${customerEmail ? `<div><strong>Email:</strong> ${customerEmail}</div>` : ''}
      <div><strong>Delivery Address:</strong> ${address}, ${city} - ${pincode}</div>
      <div><strong>Total Amount:</strong> <span style="font-size: 16px; font-weight: bold; color: #064B32;">${formatPrice(totalAmount)}</span></div>
    </div>

    <h3 style="font-size: 15px; color: #064B32; margin-bottom: 8px;">Ordered Items (${items.length}):</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${appUrl}/admin/orders" class="btn">
        📋 View in Admin Portal
      </a>
    </div>
  `;

  return sendBrevoEmail({
    to: [{ email: adminEmail, name: 'Himali Fresh Store Admin' }],
    subject: `[New Order] #${orderNumber} from ${customerName} (${formatPrice(totalAmount)})`,
    htmlContent: getEmailLayout(`New Order #${orderNumber}`, bodyHtml),
  });
}

/**
 * 3. Send Order Status Change Email to Customer
 */
export async function sendOrderStatusUpdateEmail(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  newStatus: string;
  notes?: string | null;
}) {
  const { orderNumber, customerName, customerEmail, newStatus, notes } = params;

  let badgeClass = 'badge-new';
  let statusHeadline = 'Order Status Update';
  let statusMessage = 'Your order status has been updated.';

  switch (newStatus.toUpperCase()) {
    case 'CONFIRMED':
      badgeClass = 'badge-confirmed';
      statusHeadline = 'Your Order is Confirmed! 🎉';
      statusMessage = 'Great news! Your fresh Himalayan produce order has been confirmed and is being packaged for dispatch.';
      break;
    case 'COMPLETED':
      badgeClass = 'badge-completed';
      statusHeadline = 'Order Dispatched / Completed 📦';
      statusMessage = 'Your order has been dispatched from Siliguri. Thank you for choosing Himali Fresh!';
      break;
    case 'CANCELLED':
      badgeClass = 'badge-cancelled';
      statusHeadline = 'Order Cancelled';
      statusMessage = 'Your order has been cancelled. If you believe this is in error, please reach out to us on WhatsApp.';
      break;
    case 'CONTACTED':
      badgeClass = 'badge-new';
      statusHeadline = 'Order Under Review';
      statusMessage = 'We have initiated contact regarding your order delivery schedule.';
      break;
  }

  const bodyHtml = `
    <h2 style="color: #064B32; margin-top: 0;">${statusHeadline}</h2>
    <p style="font-size: 15px; color: #334155;">Hello ${customerName},</p>
    <p style="font-size: 15px; color: #334155; line-height: 1.5;">${statusMessage}</p>

    <div class="info-box">
      <div><strong>Order Number:</strong> #${orderNumber}</div>
      <div style="margin-top: 6px;">
        <strong>Current Status:</strong> <span class="badge ${badgeClass}">${newStatus}</span>
      </div>
      ${notes ? `<div style="margin-top: 8px; color: #475569;"><em>Note from store:</em> ${notes}</div>` : ''}
    </div>

    <p style="font-size: 14px; color: #64748B;">
      If you have any questions, feel free to contact our customer care on WhatsApp.
    </p>
  `;

  return sendBrevoEmail({
    to: [{ email: customerEmail, name: customerName }],
    subject: `Order #${orderNumber} Update: ${newStatus} | Himali Fresh`,
    htmlContent: getEmailLayout(`Order #${orderNumber} Status: ${newStatus}`, bodyHtml),
  });
}

/**
 * 4. Send Contact Form Notifications (Admin alert + Customer acknowledgement)
 */
export async function sendContactFormEmails(params: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  adminEmailOverride?: string | null;
}) {
  const { name, email, phone, subject, message, adminEmailOverride } = params;
  const adminEmail = process.env.BREVO_ADMIN_EMAIL || adminEmailOverride || process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'himalifresh@gmail.com';

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  // Email to Admin
  const adminHtml = `
    <h2 style="color: #064B32; margin-top: 0;">📬 New Contact Message Received</h2>
    <div class="info-box">
      <div><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</div>
      ${phone ? `<div><strong>Phone:</strong> ${safePhone}</div>` : ''}
      <div><strong>Subject:</strong> ${safeSubject}</div>
    </div>
    <h3 style="font-size: 14px; color: #064B32;">Message:</h3>
    <div style="background: #FAF7F2; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; border: 1px solid #E2D9C8;">
      ${safeMessage}
    </div>
    <div style="margin-top: 20px;">
      <a href="mailto:${encodeURIComponent(email)}?subject=Re:%20${encodeURIComponent(subject)}" class="btn">
        Reply via Email
      </a>
    </div>
  `;

  // Email to Customer
  const customerHtml = `
    <h2 style="color: #064B32; margin-top: 0;">Thank you for contacting us, ${safeName}!</h2>
    <p style="font-size: 15px; color: #334155; line-height: 1.5;">
      We have received your message regarding <strong>"${safeSubject}"</strong>. Our team in Siliguri will review your enquiry and get back to you shortly.
    </p>
    <div class="info-box">
      <strong>Your Message:</strong><br>
      <span style="color: #475569; font-style: italic;">"${safeMessage}"</span>
    </div>
    <p style="font-size: 14px; color: #64748B;">
      For urgent assistance, you can also reach us directly on WhatsApp at <strong>+91 74777 68499</strong>.
    </p>
  `;

  await Promise.allSettled([
    sendBrevoEmail({
      to: [{ email: adminEmail, name: 'Himali Fresh Store Admin' }],
      subject: `[Contact Form] ${subject} from ${name}`,
      htmlContent: getEmailLayout(`Contact Form: ${subject}`, adminHtml),
      replyTo: { email, name },
    }),
    sendBrevoEmail({
      to: [{ email, name }],
      subject: `We have received your message | Himali Fresh`,
      htmlContent: getEmailLayout(`Thank You for Contacting Himali Fresh`, customerHtml),
    }),
  ]);
}

/**
 * 5. Send Welcome Email upon User Registration
 */
export async function sendWelcomeEmail(params: { name: string; email: string }) {
  const { name, email } = params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://himalifresh.com';

  const bodyHtml = `
    <h2 style="color: #064B32; margin-top: 0;">Welcome to the Himali Fresh Family! 🌿</h2>
    <p style="font-size: 15px; color: #334155; line-height: 1.6;">
      Namaste ${name},<br><br>
      Thank you for creating an account with <strong>Himali Fresh</strong>. We are thrilled to bring the pure, authentic flavours and artisanal goodness of the Himalayas right to your doorstep.
    </p>
    <div class="info-box">
      <div><strong>Your Account Email:</strong> ${email}</div>
      <div style="margin-top: 6px;">Enjoy seamless checkout, order history tracking, and fast doorstep delivery.</div>
    </div>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${appUrl}/shop" class="btn">
        Explore Himalayan Catalog
      </a>
    </div>
  `;

  return sendBrevoEmail({
    to: [{ email, name }],
    subject: `Welcome to Himali Fresh, ${name}! 🌿`,
    htmlContent: getEmailLayout(`Welcome to Himali Fresh`, bodyHtml),
  });
}

/**
 * 6. Send 6-digit Email Verification / OTP Code
 */
export async function sendOtpEmail(params: {
  toEmail: string;
  recipientName?: string;
  otp: string;
  purpose: 'CUSTOMER_REGISTRATION' | 'CUSTOMER_PASSWORD_RESET' | 'ADMIN_PASSWORD_RESET';
  expiresMinutes?: number;
}) {
  const { toEmail, recipientName, otp, purpose, expiresMinutes = 5 } = params;
  const name = recipientName ? escapeHtml(recipientName) : 'Valued Member';

  let subject = '';
  let heading = '';
  let description = '';

  switch (purpose) {
    case 'CUSTOMER_REGISTRATION':
      subject = `${otp} is your verification code for Himali Fresh`;
      heading = 'Verify Your Email Address';
      description = `Thank you for signing up with Himali Fresh. Please use the following 6-digit verification code to complete your registration:`;
      break;
    case 'CUSTOMER_PASSWORD_RESET':
      subject = `${otp} is your password reset code for Himali Fresh`;
      heading = 'Password Reset Request';
      description = `We received a request to reset the password for your Himali Fresh customer account. Use the 6-digit code below to proceed:`;
      break;
    case 'ADMIN_PASSWORD_RESET':
      subject = `${otp} is your admin password reset code`;
      heading = 'Admin Password Reset Request';
      description = `A password reset was requested for your Himali Fresh Administrator account. Enter this 6-digit verification code to continue:`;
      break;
  }

  const bodyHtml = `
    <h2 style="color: #064B32; margin-top: 0; font-family: serif;">${heading}</h2>
    <p style="font-size: 15px; color: #334155; line-height: 1.5;">Hello ${name},</p>
    <p style="font-size: 15px; color: #334155; line-height: 1.5;">${description}</p>
    
    <div style="background: #F8F5F0; border: 2px dashed #064B32; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
      <div style="font-size: 12px; text-transform: uppercase; color: #064B32; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px;">6-Digit Verification Code</div>
      <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #064B32; font-family: monospace;">${otp}</div>
      <div style="font-size: 12px; color: #64748B; margin-top: 8px;">Valid for <strong>${expiresMinutes} minutes</strong></div>
    </div>

    <div style="background: #FFFBEB; border-left: 4px solid #E9BE54; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #92400E; margin-bottom: 20px;">
      <strong>Security notice:</strong> Himali Fresh representatives will never ask for this code. If you did not initiate this request, you can safely ignore this email.
    </div>

    <p style="font-size: 13px; color: #64748B;">
      If you need any help, contact our Siliguri team via WhatsApp at +91 74777 68499.
    </p>
  `;

  if (!process.env.BREVO_API_KEY && process.env.NODE_ENV !== 'production') {
    console.log(`\n==================================================`);
    console.log(`[LOCAL DEV OTP CODE] -> ${toEmail}: ${otp}`);
    console.log(`(Configure BREVO_API_KEY in .env or Cloudflare secrets)`);
    console.log(`==================================================\n`);
  }

  return sendBrevoEmail({
    to: [{ email: toEmail, name: recipientName || toEmail }],
    subject,
    htmlContent: getEmailLayout(heading, bodyHtml),
    textContent: `${heading}\n\nHello ${name},\n\nYour 6-digit verification code is: ${otp}\nThis code is valid for ${expiresMinutes} minutes.\n\nDo not share this code with anyone.`,
  });
}
