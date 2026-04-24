import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** HTML-escape all user-supplied strings before interpolating into email HTML */
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Validate email address format */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Return a safe anchor tag if the URL uses http/https, otherwise plain escaped text.
 * Prevents javascript: URI injection in href attributes.
 */
function safeHref(url: string, style: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return `<a href="${esc(url)}" style="${style}">${esc(url)}</a>`
    }
  } catch {
    // invalid URL: fall through to plain text
  }
  return esc(url)
}

/** Storage bucket name */
const BUCKET = 'applications'
/** Signed URL TTL in seconds (24 hours) */
const SIGNED_URL_EXPIRES = 86400
/** Maximum number of additional documents allowed per application */
const MAX_ADDITIONAL_DOCS = 10

/** Role slug → display name map */
const ROLE_MAP: Record<string, string> = {
  'compiler-engineer': 'Compiler Engineer',
  'ml-engineer': 'ML Engineer',
  'hdl-engineer': 'HDL Engineer',
}

/** CORS: allowed origins */
function getAllowedOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null
  if (
    requestOrigin === 'https://configai.co' ||
    requestOrigin === 'https://www.configai.co' ||
    requestOrigin.startsWith('http://localhost') ||
    requestOrigin.startsWith('http://127.0.0.1')
  ) {
    return requestOrigin
  }
  return null
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (origin) Object.assign(headers, corsHeaders(origin))
  return new Response(JSON.stringify(body), { status, headers })
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

serve(async (req: Request) => {
  const requestOrigin = req.headers.get('Origin')
  const allowedOrigin = getAllowedOrigin(requestOrigin)

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (allowedOrigin) {
      return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) })
    }
    return new Response(null, { status: 403 })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, allowedOrigin)
  }

  try {
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, allowedOrigin)
    }

    const {
      name,
      email,
      role_slug,
      linkedin_url,
      cv_path,
      cover_letter_path,
      additional_paths = [],
    } = body

    // -------------------------------------------------------------------------
    // Validate required fields and types
    // -------------------------------------------------------------------------
    const missing: string[] = []
    if (!name) missing.push('name')
    if (!email) missing.push('email')
    if (!role_slug) missing.push('role_slug')
    if (!cv_path) missing.push('cv_path')
    if (!cover_letter_path) missing.push('cover_letter_path')

    if (missing.length > 0) {
      return jsonResponse({ error: `Missing required fields: ${missing.join(', ')}` }, 400, allowedOrigin)
    }

    // Coerce all string fields early so downstream code always has strings
    const nameStr = String(name)
    const emailStr = String(email)
    const roleSlugStr = String(role_slug)
    const cvPathStr = String(cv_path)
    const coverLetterPathStr = String(cover_letter_path)

    if (!isValidEmail(emailStr)) {
      return jsonResponse({ error: 'Invalid email address' }, 400, allowedOrigin)
    }

    // -------------------------------------------------------------------------
    // Resolve role display name
    // -------------------------------------------------------------------------
    const role = ROLE_MAP[roleSlugStr]
    if (!role) {
      return jsonResponse({ error: `Unknown role_slug: ${roleSlugStr}` }, 400, allowedOrigin)
    }

    // -------------------------------------------------------------------------
    // Supabase client (service role: needed for signed URLs + DB insert)
    // -------------------------------------------------------------------------
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Normalise additional_paths to a capped flat string array
    const safeAdditionalPaths: string[] = (
      Array.isArray(additional_paths)
        ? additional_paths.filter((p): p is string => typeof p === 'string')
        : []
    ).slice(0, MAX_ADDITIONAL_DOCS)

    // -------------------------------------------------------------------------
    // Generate 24-hour signed URLs for all uploaded files
    // -------------------------------------------------------------------------
    async function getSignedUrl(path: string): Promise<string> {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_EXPIRES)
      if (error || !data?.signedUrl) {
        throw new Error(`Failed to create signed URL for ${path}: ${error?.message ?? 'unknown'}`)
      }
      return data.signedUrl
    }

    const [cvUrl, coverLetterUrl, ...additionalUrls] = await Promise.all([
      getSignedUrl(cvPathStr),
      getSignedUrl(coverLetterPathStr),
      ...safeAdditionalPaths.map((p) => getSignedUrl(p)),
    ])

    // -------------------------------------------------------------------------
    // Insert row into applicants table
    // -------------------------------------------------------------------------
    const { error: dbError } = await supabase.from('applicants').insert({
      name: nameStr,
      email: emailStr,
      role,
      role_slug: roleSlugStr,
      linkedin_url: linkedin_url ? String(linkedin_url) : null,
      cv_path: cvPathStr,
      cover_letter_path: coverLetterPathStr,
      additional_paths: safeAdditionalPaths.length > 0 ? safeAdditionalPaths : null,
    })

    if (dbError) {
      console.error('DB insert error:', dbError)
      return jsonResponse({ error: 'Failed to save application' }, 500, allowedOrigin)
    }

    // -------------------------------------------------------------------------
    // Build email HTML helpers
    // -------------------------------------------------------------------------
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!

    function docLink(label: string, url: string): string {
      return `<li style="margin:6px 0;"><a href="${esc(url)}" style="color:#4f6ef7;text-decoration:none;">${label}</a></li>`
    }

    const additionalDocLinks = safeAdditionalPaths
      .map((p: string, i: number) => {
        const filename = p.split('/').pop() ?? `Additional ${i + 1}`
        const display = filename.replace(/^\d+-/, '')
        return docLink(esc(display), additionalUrls[i])
      })
      .join('\n')

    const linkedinCell = linkedin_url
      ? safeHref(String(linkedin_url), 'color:#4f6ef7;text-decoration:none;')
      : 'N/A'

    // -------------------------------------------------------------------------
    // Admin notification email
    // -------------------------------------------------------------------------
    const adminHtml = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px;">
  <h2 style="margin:0 0 8px;font-size:18px;color:#0a0f18;">New application received</h2>
  <p style="margin:0 0 24px;color:#666;font-size:14px;">Someone just applied on configai.co</p>

  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;color:#999;width:120px;">Name</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#0a0f18;">${esc(nameStr)}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;color:#999;">Email</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#0a0f18;">
        <a href="mailto:${esc(emailStr)}" style="color:#4f6ef7;text-decoration:none;">${esc(emailStr)}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;color:#999;">Role</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#0a0f18;">${esc(role)}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;font-size:13px;color:#999;">LinkedIn</td>
      <td style="padding:10px 0;font-size:14px;color:#0a0f18;">${linkedinCell}</td>
    </tr>
  </table>

  <h3 style="margin:28px 0 12px;font-size:15px;color:#0a0f18;">Documents <span style="font-weight:400;color:#999;font-size:13px;">(links valid 24 hours)</span></h3>
  <ul style="margin:0;padding:0 0 0 18px;font-size:14px;color:#0a0f18;">
    ${docLink('CV / Resume', cvUrl)}
    ${docLink('Cover Letter', coverLetterUrl)}
    ${additionalDocLinks}
  </ul>
</div>
`

    // -------------------------------------------------------------------------
    // Applicant confirmation email
    // -------------------------------------------------------------------------
    const applicantHtml = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px;">
  <h2 style="margin:0 0 16px;font-size:18px;color:#0a0f18;">Application received</h2>
  <p style="margin:0 0 16px;font-size:15px;color:#0a0f18;">Hi ${esc(nameStr)},</p>
  <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
    Thank you for applying for the <strong>${esc(role)}</strong> position at ConfigAI.
    We've received your application and will review it within 5 business days.
  </p>
  <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
    If you have any questions in the meantime, feel free to reach out at
    <a href="mailto:contact@configai.co" style="color:#4f6ef7;text-decoration:none;">contact@configai.co</a>.
  </p>
  <p style="margin:0;font-size:15px;color:#333;">Best,<br>The ConfigAI Team</p>
</div>
`

    // -------------------------------------------------------------------------
    // Send both emails via Resend
    // -------------------------------------------------------------------------
    async function sendEmail(payload: {
      from: string
      to: string
      subject: string
      html: string
    }): Promise<void> {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Resend error (${res.status}): ${text}`)
      }
    }

    await Promise.all([
      sendEmail({
        from: 'ConfigAI Careers <careers@configai.co>',
        to: 'ayush@configai.co',
        subject: `New application: ${nameStr} for ${role}`,
        html: adminHtml,
      }),
      sendEmail({
        from: 'ConfigAI Careers <careers@configai.co>',
        to: emailStr,
        subject: `We received your application for ${role} at ConfigAI`,
        html: applicantHtml,
      }),
    ])

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------
    return jsonResponse({ success: true }, 200, allowedOrigin)
  } catch (err) {
    console.error('notify-application error:', err)
    return jsonResponse({ error: 'Internal server error' }, 500, allowedOrigin)
  }
})
