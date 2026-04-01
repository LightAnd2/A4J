exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
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

  // verify recaptcha
  const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
  });

  const { success, score } = await verify.json();

  if (!success || score < 0.5) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Spam detected' }) };
  }

  // send email
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'contact@apostles4jesus.com',
      to: 'apostles4jesus@gmail.com',
      reply_to: email,
      subject: `[A4J] Message from ${firstName} ${lastName}`,
      html: `
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    })
  });

  if (!res.ok) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Email failed' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
