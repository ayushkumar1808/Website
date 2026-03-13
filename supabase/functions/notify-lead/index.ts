import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const payload = await req.json()
  const record = payload.record

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
    },
    body: JSON.stringify({
      from: 'ConfigAI <noreply@configai.co>',
      to: 'ayush@configai.co',
      subject: `New lead: ${record.name || record.email}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px;">
          <h2 style="margin:0 0 8px;font-size:18px;color:#0a0f18;">New Get Started submission</h2>
          <p style="margin:0 0 24px;color:#666;font-size:14px;">Someone just filled out the form on configai.co</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;color:#999;width:90px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#0a0f18;">${record.name || '—'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;color:#999;">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#0a0f18;">${record.email}</td></tr>
            <tr><td style="padding:10px 0;font-size:13px;color:#999;">Company</td><td style="padding:10px 0;font-size:14px;color:#0a0f18;">${record.company || '—'}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#aaa;">Submitted at ${new Date(record.created_at).toLocaleString('en-US', { timeZone: 'UTC' })} UTC</p>
        </div>
      `
    })
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' }
  })
})
