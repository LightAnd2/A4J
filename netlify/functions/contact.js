// Simple in-memory rate limiter (resets on function cold start)
const rateLimit = new Map();
const RATE_LIMIT = 5;        // max submissions
const RATE_WINDOW = 60 * 60 * 1000; // per hour (ms)

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, start: now };

  // Reset window if expired
  if (now - entry.start > RATE_WINDOW) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count++;
  rateLimit.set(ip, entry);
  return entry.count > RATE_LIMIT;
}

// Strip all HTML tags and trim whitespace
function sanitize(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Rate limiting by IP
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (isRateLimited(ip)) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Too many requests. Please try again later.' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const { firstName, lastName, email, message, token } = data;

  if (!firstName || !lastName || !email || !message || !token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
  }

  // Sanitize all inputs
  const cleanFirst   = sanitize(firstName).slice(0, 100);
  const cleanLast    = sanitize(lastName).slice(0, 100);
  const cleanEmail   = sanitize(email).slice(0, 200);
  const cleanMessage = sanitize(message).slice(0, 5000);

  // Validate email format
  if (!isValidEmail(cleanEmail)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
  }

  // Verify reCAPTCHA
  const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
  });

  const { success, score } = await verify.json();

  if (!success || score < 0.5) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Spam detected' }) };
  }

  // Send email
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'contact@apostles4jesus.com',
      to: 'apostles4jesus@gmail.com',
      reply_to: cleanEmail,
      subject: `[A4J] Message from ${cleanFirst} ${cleanLast}`,
      html: `
        <p><b>Name:</b> ${cleanFirst} ${cleanLast}</p>
        <p><b>Email:</b> ${cleanEmail}</p>
        <p><b>Message:</b></p>
        <p>${cleanMessage.replace(/\n/g, '<br>')}</p>
      `
    })
  });

  if (!res.ok) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Email failed' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
