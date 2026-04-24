// ─── Supabase client ───────────────────────────────────────────────────────
const SUPABASE_URL = 'https://wvatsmixbflbpugizpwu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2YXRzbWl4YmZsYnB1Z2l6cHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzY5MzQsImV4cCI6MjA4OTAxMjkzNH0.SmaJx6z5VR9EhJBl0vnua1M8pmwEKl67WluGUDb9rDM'
const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── EN/DE Language Toggle ─────────────────────────────────────────────────
function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'de' ? (el.dataset.de || el.dataset.en) : el.dataset.en
  })
  document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('hidden', lang !== 'en'))
  document.querySelectorAll('.lang-de').forEach(el => el.classList.toggle('hidden', lang !== 'de'))
  const btnEn = document.getElementById('lang-btn-en')
  const btnDe = document.getElementById('lang-btn-de')
  if (btnEn) btnEn.setAttribute('data-active', lang === 'en' ? 'true' : 'false')
  if (btnDe) btnDe.setAttribute('data-active', lang === 'de' ? 'true' : 'false')
  localStorage.setItem('lang', lang)
}

window.addEventListener('DOMContentLoaded', () => {
  applyLang(localStorage.getItem('lang') || 'en')
})

// ─── File Validation ───────────────────────────────────────────────────────
const CV_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ADDITIONAL_MIME = [...CV_MIME, 'application/zip', 'application/x-zip-compressed']
const MAX_CV_BYTES = 10 * 1024 * 1024
const MAX_ADDITIONAL_BYTES = 20 * 1024 * 1024

function validateFile(file, allowedTypes, maxBytes) {
  if (!allowedTypes.includes(file.type)) return 'Invalid file type'
  if (file.size > maxBytes) return `File exceeds ${maxBytes / 1024 / 1024} MB limit`
  return null
}

// ─── Application Form Submission ───────────────────────────────────────────
async function submitApplication(event) {
  event.preventDefault()
  const form = event.target
  const btn = form.querySelector('[data-submit-btn]')
  const errorEl = form.querySelector('[data-form-error]')

  const roleSlug = form.dataset.roleSlug
  const name = form.querySelector('[name=name]').value.trim()
  const email = form.querySelector('[name=email]').value.trim()
  const linkedinUrl = form.querySelector('[name=linkedin_url]').value.trim()
  const cvFile = form.querySelector('[name=cv]').files[0]
  const coverFile = form.querySelector('[name=cover_letter]').files[0]
  const additionalFiles = [...(form.querySelector('[name=additional]').files || [])]

  // Clear previous error using textContent (safe, no XSS risk)
  errorEl.textContent = ''

  if (!cvFile) return showError(errorEl, btn, 'Please upload your CV.')
  const cvErr = validateFile(cvFile, CV_MIME, MAX_CV_BYTES)
  if (cvErr) return showError(errorEl, btn, 'CV: ' + cvErr)

  if (!coverFile) return showError(errorEl, btn, 'Please upload your cover letter.')
  const coverErr = validateFile(coverFile, CV_MIME, MAX_CV_BYTES)
  if (coverErr) return showError(errorEl, btn, 'Cover letter: ' + coverErr)

  for (const f of additionalFiles) {
    const err = validateFile(f, ADDITIONAL_MIME, MAX_ADDITIONAL_BYTES)
    if (err) return showError(errorEl, btn, f.name + ': ' + err)
  }

  setBtn(btn, 'Uploading files...')

  try {
    const applicantId = crypto.randomUUID()
    const folder = roleSlug + '/' + applicantId

    const cvPath = folder + '/cv' + extOf(cvFile.name)
    const { error: e1 } = await _sb.storage.from('applications').upload(cvPath, cvFile)
    if (e1) throw new Error('CV upload failed: ' + e1.message)

    const coverPath = folder + '/cover-letter' + extOf(coverFile.name)
    const { error: e2 } = await _sb.storage.from('applications').upload(coverPath, coverFile)
    if (e2) throw new Error('Cover letter upload failed: ' + e2.message)

    const additionalPaths = []
    for (let i = 0; i < additionalFiles.length; i++) {
      const f = additionalFiles[i]
      const p = folder + '/additional/' + i + '-' + f.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const { error: e3 } = await _sb.storage.from('applications').upload(p, f)
      if (e3) throw new Error(f.name + ' upload failed: ' + e3.message)
      additionalPaths.push(p)
    }

    setBtn(btn, 'Submitting...')

    const res = await fetch(SUPABASE_URL + '/functions/v1/notify-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        name, email, role_slug: roleSlug, linkedin_url: linkedinUrl,
        cv_path: cvPath, cover_letter_path: coverPath, additional_paths: additionalPaths,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Server error ' + res.status)
    }

    window.location.href = 'thank-you.html'
  } catch (err) {
    showError(errorEl, btn, err.message)
  }
}

function extOf(filename) {
  const i = filename.lastIndexOf('.')
  return i >= 0 ? filename.slice(i) : ''
}

function setBtn(btn, text) {
  btn.textContent = text
  btn.disabled = true
}

function showError(errorEl, btn, msg) {
  errorEl.textContent = msg   // textContent is safe — no HTML parsing
  btn.textContent = 'Submit Application'
  btn.disabled = false
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('application-form')
  if (form) form.addEventListener('submit', submitApplication)

  // Show filename when file is selected
  document.querySelectorAll('.upload-zone input[type=file]').forEach(input => {
    input.addEventListener('change', () => {
      const nameEl = input.closest('.upload-zone').querySelector('.file-name')
      if (nameEl) nameEl.textContent = input.files[0]?.name || ''
    })
  })
})
