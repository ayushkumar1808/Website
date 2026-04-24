# Careers Page Design Spec
**Date:** 2026-04-24
**Project:** ConfigAI Website (configai.co)
**Deployment:** GitHub Pages (custom domain via CNAME)
**Status:** Approved for implementation

---

## 1. Overview

Add a careers section to the ConfigAI static website featuring 3 job postings, full role detail pages, an application form with file uploads, a Supabase applicants table, Supabase Storage for documents, and Resend email automation (admin notification + applicant confirmation).

**Style rule:** No em dashes anywhere in copy or UI. Colons or middots instead.

---

## 2. New Pages

| File | Purpose |
|---|---|
| `careers.html` | Landing page listing all 3 open roles |
| `compiler-engineer.html` | Full job detail + application form |
| `ml-engineer.html` | Full job detail + application form |
| `hdl-engineer.html` | Full job detail + application form |
| `thank-you.html` | Post-submission confirmation page |

All pages share the existing nav/footer from `index.html`. Standard scroll (no snap). No build step — plain HTML + Tailwind CDN + Supabase JS CDN, same as the rest of the site.

**Deployment note:** The site is hosted on GitHub Pages with a custom domain (`configai.co`) via the existing `CNAME` file. Supabase edge functions are called directly from the browser via their Supabase project URL — no Netlify functions or redirects are used. The `netlify.toml` file in the repo is vestigial and can be ignored.

---

## 3. Nav and Footer Updates

**Nav:** Add a "Careers" link to the desktop nav and mobile menu in `index.html`, `demo.html`, and all new pages.

**Footer:** Add a "Careers" link to the footer link row in all pages.

---

## 4. careers.html

### Hero
- Eyebrow tag: "Careers at ConfigAI"
- Title (Playfair Display, serif): "Build the future of AI hardware."
- Subtitle: "We're a small team solving a hard problem: turning ML models into FPGA hardware automatically. Based in Saarbrücken, backed by Max Planck Institute for Informatics and Google for Startups."

### Job Cards Grid (3-column, responsive to 1-col on mobile)
Each card contains:
- Role icon (SVG)
- Job title
- Meta: 15 hrs / week · On-site · Saarbrücken · Part-time · m/w/d
- 2-sentence role description
- "View role" button linking to the role detail page

### EN/DE Language Toggle
- Positioned in the nav bar (desktop) and mobile menu
- Toggles all visible text between English and German
- Implementation: `data-en` and `data-de` attributes on all translatable elements, toggled via a small JS snippet
- Default: English

---

## 5. Job Detail Pages (compiler-engineer.html, ml-engineer.html, hdl-engineer.html)

### Layout
Two-column on desktop (main content + sticky sidebar), single column on mobile.

### Breadcrumb
`Careers › [Role Name]`

### Sidebar (sticky)
- Department
- Location: On-site · Saarbrücken
- Commitment: 15 hrs / week
- Type: Part-time · m/w/d
- "Apply Now" button (smooth-scrolls to the form anchor below)
- LinkedIn + X (Twitter) share icons

### Content Sections (left column)
1. About ConfigAI
2. About the Role
3. Key Responsibilities (bullet list)
4. Required Skills & Experience (bullet list)
5. Preferred Skills — Nice to Have (bullet list)
6. Why Join Us? (bullet list)

### Application Form (bottom of page, below a divider)
- Triggered by "Apply Now" — page smooth-scrolls to `#apply`
- Role field is pre-filled with the page's role and locked (read-only)
- Fields:
  - Full Name (required)
  - Email (required)
  - Applying For (pre-filled, locked)
  - LinkedIn Profile (optional)
- Upload zones (3):
  - CV / Résumé — PDF or DOC only, max 10 MB, **required**
  - Cover Letter — PDF or DOC only, max 10 MB, **required**
  - Additional Documents — PDF, DOC or ZIP, max 20 MB total, **optional**
- File type and size are validated client-side before upload begins. Invalid files show an inline error on the upload zone; the submit button remains disabled until all required files are valid.
- Submit button: "Submit Application"
- On success: redirect to `thank-you.html`
- On error: inline error message, form re-enabled

---

## 6. Job Copy — English

### Compiler Engineer

**Card description:** Work on the compiler pipeline that maps ML computation graphs to FPGA primitives: parsing, IR transformations and code generation.

**About the Role:** We are looking for a Compiler Engineer to work on the core pipeline that maps ML computation graphs to FPGA primitives. You will work directly on graph-level IR transformations, operator scheduling and hardware code generation. This is a 15 hrs/week, on-site role in Saarbrücken, open to students and professionals (m/w/d).

**Key Responsibilities:**
- Design and implement IR transformations that map high-level ML ops to hardware-friendly primitives.
- Build and maintain the operator scheduling and placement passes in the compiler pipeline.
- Contribute to the code generation backend that emits Verilog/VHDL from the compiler IR.
- Collaborate with ML and HDL engineers to ensure correctness and performance of compiled hardware.
- Write unit and integration tests for new compiler passes and regression coverage.
- Profile and optimise compile-time performance for large model graphs.

**Required Skills:**
- Strong fundamentals in compiler design: IR, passes, transformations and code generation.
- Proficiency in Python or C++ (our compiler pipeline uses both).
- Understanding of ML computation graphs and common operator patterns (conv, matmul, attention).
- Experience with MLIR, LLVM or a similar compiler framework is a strong plus.
- Comfortable working in a fast-moving research-to-product environment.

**Preferred Skills:**
- Familiarity with FPGA architecture: LUTs, DSPs, BRAMs and routing constraints.
- Experience with hardware description languages (Verilog or VHDL).
- Background in quantisation and operator fusion techniques for inference.
- Knowledge of HLS toolchains such as Xilinx Vitis HLS.

**Why Join Us:**
- Work on a genuinely hard technical problem at the intersection of ML and hardware.
- Small team: your contributions will have direct, visible impact on the product.
- Research environment: direct access to expertise at the Max Planck Institute for Informatics.
- Flexible 15 hrs/week commitment — ideal for students or researchers pursuing parallel work.

---

### ML Engineer

**Card description:** Bridge the gap between ML model architectures and hardware constraints: quantisation, operator fusion and hardware-aware model optimisation.

**About the Role:** We are looking for an ML Engineer to bridge the gap between ML model design and the constraints of FPGA hardware. You will work on hardware-aware optimisation techniques that make models smaller, faster and deployable on FPGAs without accuracy loss. This is a 15 hrs/week, on-site role in Saarbrücken, open to students and professionals (m/w/d).

**Key Responsibilities:**
- Develop and apply quantisation techniques (INT8, INT4 and mixed-precision) to ML models targeting FPGA deployment.
- Design operator fusion strategies that reduce memory bandwidth and improve throughput on hardware.
- Evaluate model architectures for hardware friendliness and advise on changes that improve compile quality.
- Collaborate with compiler engineers to ensure that optimised models map cleanly through the compiler pipeline.
- Benchmark inference accuracy and latency on compiled FPGA hardware.
- Maintain a library of hardware-aware model optimisation utilities for the compiler toolchain.

**Required Skills:**
- Strong understanding of ML model architectures: CNNs, Transformers and their computational patterns.
- Hands-on experience with quantisation frameworks (PyTorch quantisation, ONNX or equivalent).
- Familiarity with hardware constraints that affect ML inference: memory bandwidth, parallelism and dataflow.
- Proficiency in Python and comfort with ML research codebases.
- Ability to interpret hardware profiling data and translate it into model-level optimisation decisions.

**Preferred Skills:**
- Experience with FPGA-targeted ML frameworks such as hls4ml or FINN.
- Background in knowledge distillation or neural architecture search.
- Understanding of compiler IRs and how ML ops are represented in formats such as ONNX or MLIR.
- Familiarity with hardware simulation or emulation environments.

**Why Join Us:**
- Rare opportunity to work where ML research meets silicon: every optimisation you make ships to real hardware.
- Small team: your contributions will have direct, visible impact on the product.
- Research environment: direct access to expertise at the Max Planck Institute for Informatics.
- Flexible 15 hrs/week commitment: ideal for students or researchers pursuing parallel work.

---

### HDL Engineer

**Key Responsibilities:**
- Design reusable RTL modules (Verilog/VHDL) that the compiler uses as hardware building blocks.
- Review and improve the HDL templates emitted by the compiler code generation backend.
- Write testbenches to verify functional correctness of generated hardware modules.
- Optimise RTL for area, latency and throughput on Xilinx and Intel FPGA families.
- Collaborate with compiler engineers to define clean interfaces between generated and hand-written HDL.
- Support FPGA implementation flows: synthesis, place-and-route and timing closure.

**Card description:** Design and optimise the HDL templates and RTL modules that the compiler emits. Verilog/VHDL expertise required.

**About the Role:** We are looking for an HDL Engineer to design and optimise the hardware building blocks that our compiler generates and assembles. You will write hand-crafted RTL modules in Verilog or VHDL, create testbenches, and work closely with compiler engineers to ensure the generated hardware meets area and timing targets. This is a 15 hrs/week, on-site role in Saarbrücken, open to students and professionals (m/w/d).

**Required Skills:**
- Strong proficiency in Verilog or VHDL for RTL design.
- Experience with FPGA implementation flows: synthesis, place-and-route and timing analysis.
- Understanding of common digital design patterns: pipelining, FIFOs, state machines and AXI interfaces.
- Ability to write simulation testbenches and interpret waveform results.
- Comfortable with Xilinx Vivado or Intel Quartus toolchains.

**Preferred Skills:**
- Experience with High-Level Synthesis (HLS) tools such as Xilinx Vitis HLS or Bambu.
- Familiarity with ML accelerator architectures: systolic arrays, PE arrays or dataflow processors.
- Knowledge of formal verification or property checking.
- Background in low-power design or timing-driven optimisation.

**Why Join Us:**
- Your RTL work directly underpins every model we compile: close to the metal, real impact.
- Small team: your contributions will have direct, visible impact on the product.
- Research environment: direct access to expertise at the Max Planck Institute for Informatics.
- Flexible 15 hrs/week commitment: ideal for students or researchers pursuing parallel work.

---

## 7. Job Copy — German (DE toggle)

All German copy uses formal "Sie" register appropriate for a professional job posting.

### Compiler Engineer (DE)

**Hero tag:** Karriere bei ConfigAI
**Hero title:** Gestalte die Zukunft der KI-Hardware.
**Hero subtitle:** Wir sind ein kleines Team, das ein schwieriges Problem löst: ML-Modelle werden automatisch in FPGA-Hardware umgewandelt. Ansässig in Saarbrücken, unterstützt vom Max-Planck-Institut für Informatik und Google for Startups.

**Card description:** Arbeit an der Compiler-Pipeline, die ML-Berechnungsgraphen auf FPGA-Primitive abbildet: Parsing, IR-Transformationen und Code-Generierung.

**About the Role (DE):** Wir suchen einen Compiler Engineer für die Kern-Pipeline, die ML-Berechnungsgraphen auf FPGA-Primitive abbildet. Sie arbeiten direkt an graphebenen IR-Transformationen, Operator-Scheduling und Hardware-Code-Generierung. Die Stelle umfasst 15 Std./Woche, ist vor Ort in Saarbrücken und offen für Studierende und Berufstätige (m/w/d).

**Why Join Us (DE):**
- Arbeit an einem wirklich anspruchsvollen technischen Problem an der Schnittstelle von ML und Hardware.
- Kleines Team: Ihre Beiträge haben direkten, sichtbaren Einfluss auf das Produkt.
- Forschungsumgebung: direkter Zugang zur Expertise des Max-Planck-Instituts für Informatik.
- Flexibles Engagement mit 15 Std./Woche: ideal für Studierende oder Forschende.

### ML Engineer (DE)

**Card description:** Brückenbau zwischen ML-Modellarchitekturen und Hardware-Einschränkungen: Quantisierung, Operator-Fusion und hardware-bewusste Modelloptimierung.

**About the Role (DE):** Wir suchen einen ML Engineer, der die Lücke zwischen ML-Modelldesign und den Anforderungen von FPGA-Hardware überbrückt. Sie arbeiten an hardware-bewussten Optimierungstechniken, die Modelle kleiner, schneller und ohne Genauigkeitsverlust auf FPGAs deployfähig machen. Die Stelle umfasst 15 Std./Woche, ist vor Ort in Saarbrücken und offen für Studierende und Berufstätige (m/w/d).

### HDL Engineer (DE)

**Card description:** Entwurf und Optimierung der HDL-Templates und RTL-Module, die der Compiler generiert. Kenntnisse in Verilog/VHDL erforderlich.

**About the Role (DE):** Wir suchen einen HDL Engineer, der die Hardware-Bausteine entwirft und optimiert, die unser Compiler generiert und zusammensetzt. Sie schreiben handgefertigte RTL-Module in Verilog oder VHDL, erstellen Testbenches und arbeiten eng mit Compiler-Ingenieuren zusammen. Die Stelle umfasst 15 Std./Woche, ist vor Ort in Saarbrücken und offen für Studierende und Berufstätige (m/w/d).

---

## 8. thank-you.html

- Simple centred page matching the dark site theme
- Heading: "Application received."
- Body: "Thank you for applying to ConfigAI. We have sent a confirmation to your email address. We will review your application and get back to you within 5 business days. In the meantime, feel free to reach out at contact@configai.co."
- Two links: "View open roles" (→ careers.html) and "Back to home" (→ index.html)
- No form, no Supabase calls
- EN/DE toggle applies: same `data-en` / `data-de` pattern as all other pages

---

## 9. Supabase Schema

### Table: `applicants`

```sql
create table applicants (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text not null,
  role              text not null,       -- display name e.g. "Compiler Engineer"
  role_slug         text not null,       -- e.g. "compiler-engineer"
  linkedin_url      text,
  cv_path           text not null,
  cover_letter_path text not null,
  additional_paths  jsonb default '[]',  -- JSON array of path strings
  created_at        timestamptz default now()
);
```

Row-level security:
- `INSERT`: allowed for `anon` role
- `SELECT`: **denied** for `anon` role — all applicant data including emails is private
- `UPDATE` / `DELETE`: denied for `anon` role

**`additional_paths` uses `jsonb`** storing a flat array of path strings, e.g. `["compiler-engineer/abc-123/additional/portfolio.pdf"]`. The edge function inserts it as a JSON array directly.

### Storage Bucket: `applications`

- Bucket name: `applications`
- Public: false (private bucket, files not publicly accessible)
- Folder structure: `{role-slug}/{applicant-id}/cv.pdf`, `{role-slug}/{applicant-id}/cover-letter.pdf`, `{role-slug}/{applicant-id}/additional/filename`
- Role slugs: `compiler-engineer`, `ml-engineer`, `hdl-engineer`
- Storage policy: anon can insert into `applications/*` (no read/delete for anon)
- The edge function runs with the **service role key** and generates a **Supabase signed URL** (24-hour expiry) for each uploaded file. These signed URLs are included in the admin notification email so the files are immediately accessible without requiring a manual Supabase dashboard visit.
- **Orphaned file handling (accepted debt):** if the edge function fails after files are already uploaded to Storage, those files will remain in the bucket with no corresponding DB row. This is acceptable for v1. A cleanup job or Storage lifecycle rule can be added later. The frontend reports an error and does not redirect to `thank-you.html` in this case.

---

## 10. Edge Function: `notify-application`

**Location:** `supabase/functions/notify-application/index.ts`

**CORS:** The function must return `Access-Control-Allow-Origin` for both `https://configai.co` and `https://www.configai.co` (check the `Origin` request header and echo it back if it matches either). Also handle `OPTIONS` preflight. During local development, also allow `http://localhost:*` and `http://127.0.0.1:*`. Follow the same CORS pattern as `notify-lead`.

**Required Supabase secrets (set via `supabase secrets set`):**
- `RESEND_API_KEY` — already exists, shared with `notify-lead`
- `SUPABASE_SERVICE_ROLE_KEY` — for DB insert and Storage signed URL generation (Supabase injects this automatically as `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` in edge functions)
- `SUPABASE_URL` — injected automatically as `Deno.env.get('SUPABASE_URL')`

**Request:** POST with JSON body:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "Compiler Engineer",
  "role_slug": "compiler-engineer",
  "linkedin_url": "https://linkedin.com/in/jane",
  "cv_path": "compiler-engineer/abc-123/cv.pdf",
  "cover_letter_path": "compiler-engineer/abc-123/cover-letter.pdf",
  "additional_paths": ["compiler-engineer/abc-123/additional/portfolio.pdf"]
}
```

**Steps (in order):**
1. Generate Supabase signed URLs (**24-hour expiry**) for cv_path, cover_letter_path and each path in additional_paths using the service role key
2. Insert row into `applicants` table using the service role key
3. Send admin notification email via Resend (include signed URLs)
4. Send applicant confirmation email via Resend
5. Return `200` with `{ success: true }` or `500` with error detail

**Admin email (to ayush@configai.co):**
- From: `ConfigAI Careers <careers@configai.co>`
- Subject: `New application: [Name] for [Role]`
- Body: name, email, role, LinkedIn URL (if provided), clickable signed download links for all uploaded files, timestamp

**Applicant confirmation email:**
- From: `ConfigAI Careers <careers@configai.co>`
- To: applicant's email
- Subject: `We received your application for [Role] at ConfigAI`
- Body: confirmation that the application was received, role name, expected response time of 5 business days, contact email (contact@configai.co)

---

## 11. Frontend Submission Flow (Approach C)

```
User fills form
  ↓
① JS uploads CV to Supabase Storage (supabase.storage.from('applications').upload(...))
② JS uploads Cover Letter to Supabase Storage
③ JS uploads Additional Docs (if provided) to Supabase Storage
  ↓ (all uploads parallel where possible)
④ JS POSTs metadata + file paths to /functions/v1/notify-application
  ↓
⑤ Edge function: inserts applicants row + sends 2 Resend emails
  ↓
⑥ JS redirects to thank-you.html
```

Loading states: button shows "Uploading files..." during step ①-③, then "Submitting..." during step ④-⑤.

Error handling: if any upload fails, show inline error and re-enable form. No partial submissions reach the DB.

---

## 12. EN/DE Language Toggle

Implementation using `data-en` / `data-de` attributes:

```html
<h1 data-en="Build the future of AI hardware." data-de="Gestalte die Zukunft der KI-Hardware.">
  Build the future of AI hardware.
</h1>
```

A small JS snippet reads the current language from `localStorage` (default `en`), and on toggle sets all `[data-en]` elements' `textContent` to the matching attribute. The toggle button state (EN / DE) updates accordingly. Language choice persists across pages via `localStorage`.

**Role field:** The "Applying For" field stores the role **slug** (e.g. `compiler-engineer`) as the form value sent to the edge function — not the display string. The display string (e.g. "Compiler Engineer") is derived from the slug server-side and shown in emails. This means the correct role is recorded in the DB regardless of which language the applicant had selected when they submitted.

---

## 13. File Deliverables

```
Website/
  careers.html                          ← new
  compiler-engineer.html                ← new
  ml-engineer.html                      ← new
  hdl-engineer.html                     ← new
  thank-you.html                        ← new
  index.html                            ← update: add Careers to nav + footer
  demo.html                             ← update: add Careers to nav + footer
  supabase/functions/notify-application/index.ts  ← new
```

---

## 14. Out of Scope

- Admin dashboard for viewing applications
- Applicant login or status tracking
- File download links in admin email (Supabase Storage signed URLs can be added later)
- PDF preview in browser
- GDPR consent checkbox (can be added as a follow-up)
