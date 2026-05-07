const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function formatDateFlat(startDate, endDate) {
  if (!startDate) return '';
  const start = new Date(startDate + '-01');
  const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (!endDate) return `${startStr} – Present`;
  const end = new Date(endDate + '-01');
  const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short' })} – ${endStr}`;
  }
  return `${startStr} – ${endStr}`;
}

function yearOf(dateStr) {
  return dateStr ? parseInt(dateStr.slice(0, 4), 10) : 0;
}

const EARLIER_CUTOFF = 2015;

function render(resume) {
  const basics = resume.basics || {};
  const work = resume.work || [];
  const skills = resume.skills || [];
  const education = resume.education || [];
  const references = (resume.references || []).slice(0, 3);

  const recentWork = work.filter(j => yearOf(j.endDate) >= EARLIER_CUTOFF || !j.endDate);
  const earlierWork = work.filter(j => j.endDate && yearOf(j.endDate) < EARLIER_CUTOFF);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escape(basics.name || 'CV')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 10mm 14mm; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: #ffffff;
  color: #1a1a1a;
  font-family: 'Inter', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-size: 9pt;
  line-height: 1.45;
}

/* ── Header ── */
.cv-header {
  padding-bottom: 12pt;
  margin-bottom: 8pt;
}
.cv-name {
  font-size: 22pt;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.1;
  text-transform: uppercase;
  color: #1a1a1a;
  margin: 0 0 4pt 0;
}
.cv-tagline {
  font-size: 10pt;
  font-weight: 500;
  color: #4a4a4a;
  margin: 4pt 0 8pt 0;
  letter-spacing: 0.3px;
}
.cv-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 10pt;
  margin-top: 8pt;
}

/* ── Contact ── */
.cv-contact {
  display: flex;
  flex-direction: column;
}
.cv-contact-links {
  display: block;
  margin-top: 3pt;
}
.cv-contact a, .cv-location {
  color: #1a1a1a;
  text-decoration: none;
  font-size: 8.5pt;
  display: inline;
  margin-right: 14pt;
}
.cv-location {
  font-size: 8.5pt;
  color: #1a1a1a;
}

/* ── Summary ── */
.cv-summary {
  font-size: 9pt;
  line-height: 1.5;
  color: #2a2a2a;
  margin: 8pt 0 4pt 0;
}

/* ── Section headings ── */
.section-title {
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #1a1a1a;
  margin: 10pt 0 6pt 0;
  padding-bottom: 3pt;
  border-bottom: 1.5pt solid #1a1a1a;
  break-after: avoid;
}

/* ── Experience ── */
.grid-item {
  margin-bottom: 8pt;
  padding-bottom: 8pt;
  border-bottom: 0.5pt solid #e5e5e5;
  break-inside: avoid;
}
.grid-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.item-title {
  font-size: 10pt;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2pt;
}
.item-title a { color: inherit; text-decoration: none; }
.item-date {
  font-size: 8.5pt;
  font-weight: 400;
  color: #6a6a6a;
}
.item-subtitle {
  font-size: 8.5pt;
  font-weight: 500;
  color: #4a4a4a;
}
.highlights-list {
  margin: 2pt 0 0 0;
  padding-left: 12pt;
  list-style: none;
}
.highlights-list li {
  position: relative;
  font-size: 8.5pt;
  line-height: 1.4;
  margin-bottom: 2pt;
  color: #2a2a2a;
}
.highlights-list li::before {
  content: '▪';
  position: absolute;
  left: -10pt;
  color: #1a1a1a;
  font-size: 7pt;
  line-height: 1.6;
}
.item-description {
  font-size: 8.5pt;
  line-height: 1.4;
  color: #4a4a4a;
}

/* ── Earlier career ── */
.earlier-list {
  display: flex;
  flex-direction: column;
  gap: 3pt;
}
.earlier-item {
  display: flex;
  gap: 10pt;
}
.earlier-date {
  width: 88pt;
  flex-shrink: 0;
  font-size: 8pt;
  color: #6a6a6a;
  padding-right: 8pt;
}
.earlier-content {
  font-size: 8.5pt;
  color: #4a4a4a;
}
.earlier-content strong {
  color: #1a1a1a;
  font-weight: 600;
}

/* ── Skills ── */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 3pt;
}
.skill-row {
  display: flex;
  gap: 8pt;
  font-size: 8.5pt;
  break-inside: avoid;
}
.skill-label {
  font-weight: 700;
  width: 110pt;
  flex-shrink: 0;
  color: #1a1a1a;
}
.skill-values {
  color: #4a4a4a;
  flex: 1;
}

/* ── Education ── */
.edu-item {
  display: flex;
  gap: 10pt;
  margin-bottom: 4pt;
  break-inside: avoid;
}
.edu-date {
  width: 88pt;
  flex-shrink: 0;
  font-size: 8pt;
  color: #6a6a6a;
}
.edu-content {
  font-size: 8.5pt;
  color: #2a2a2a;
}

/* ── Recommendations ── */
.rec-item {
  display: grid;
  grid-template-columns: 90pt 1fr;
  gap: 8pt;
  margin-bottom: 8pt;
  break-inside: avoid;
}
.rec-meta { font-size: 8pt; color: #4a4a4a; }
.rec-name { font-weight: 600; color: #1a1a1a; margin-bottom: 2pt; }
.rec-title { color: #6a6a6a; margin-bottom: 2pt; }
.rec-date { color: #8a8a8a; }
.rec-text { font-size: 8pt; line-height: 1.45; color: #2a2a2a; }
.rec-text p { margin: 0 0 4pt 0; }
.rec-text p:last-child { margin-bottom: 0; }

/* ── Footer ── */
.cv-footer {
  margin-top: 10pt;
  padding-top: 4pt;
  border-top: 0.5pt solid #cccccc;
  font-size: 8pt;
  color: #888888;
  text-align: center;
  font-style: italic;
}
.cv-footer a { color: #888888; text-decoration: underline; }

@media print {
  html, body { background: white; }
  .section-title { break-after: avoid; }
  .grid-item { break-inside: avoid; }
  .earlier-item { break-inside: avoid; }
}
</style>
</head>
<body>
`;

  const emailIcon    = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
  const globeIcon    = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  const githubIcon   = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
  const linkedinIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`;
  const locationIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

  // Header
  html += `<header class="cv-header">`;
  html += `<h1 class="cv-name">${escape(basics.name || '')}</h1>`;
  html += `<div class="cv-tagline">${escape(basics.label || '')}</div>`;
  if (basics.summary) {
    html += basics.summary
      .split(/\n\n+/)
      .map(p => `<p class="cv-summary">${escape(p.replace(/\n/g, ' '))}</p>`)
      .join('');
  }
  html += `<div class="cv-meta-row">`;
  html += `<div class="cv-contact">`;
  html += `<div class="cv-contact-links">`;
  if (basics.email) html += `<a href="mailto:${escape(basics.email)}">${emailIcon}${escape(basics.email)}</a>`;
  html += `<a href="https://cv.functional.work">${globeIcon}cv.functional.work</a>`;
  if (basics.profiles) {
    basics.profiles.forEach(p => {
      if (p.network && p.network.toLowerCase() === 'github') {
        html += `<a href="${escape(p.url)}">${githubIcon}${escape(p.url.replace(/^https?:\/\//, ''))}</a>`;
      }
    });
  }
  html += `</div>`;
  html += `<div class="cv-contact-links">`;
  if (basics.profiles) {
    basics.profiles.forEach(p => {
      if (p.network && p.network.toLowerCase() !== 'github') {
        html += `<a href="${escape(p.url)}">${linkedinIcon}${escape(p.url.replace(/^https?:\/\//, ''))}</a>`;
      }
    });
  }
  if (basics.location) {
    const loc = [basics.location.city, basics.location.region].filter(Boolean).join(', ');
    html += `<span class="cv-location">${locationIcon}${escape(loc)} | Remote</span>`;
  }
  html += `</div>`;
  html += `</div></div></header>`;

  // Experience — recent
  if (recentWork.length) {
    html += `<h2 class="section-title">Experience</h2>`;
    recentWork.forEach(job => {
      const dateStr = formatDateFlat(job.startDate, job.endDate);
      const nameHtml = job.url ? `<a href="${escape(job.url)}">${escape(job.name)}</a>` : escape(job.name);
      html += `<div class="grid-item">`;
      html += `<div class="item-title">${nameHtml}${dateStr ? ` <span class="item-date">(${dateStr})</span>` : ''}</div>`;
      html += `<div class="item-subtitle">${escape(job.position || '')}</div>`;
      if (job.highlights && job.highlights.length) {
        if (job.highlights.length === 1) {
          html += `<p class="item-description">${escape(job.highlights[0].replace(/\n/g, ' '))}</p>`;
        } else {
          html += `<ul class="highlights-list">`;
          job.highlights.forEach(h => {
            html += `<li>${escape(h.replace(/\n/g, ' '))}</li>`;
          });
          html += `</ul>`;
        }
      } else if (job.summary) {
        html += `<p class="item-description">${escape(job.summary.replace(/\n/g, ' '))}</p>`;
      }
      html += `</div>`;
    });
  }

  // Experience — earlier
  if (earlierWork.length) {
    html += `<h2 class="section-title">Earlier Career</h2>`;
    html += `<div class="earlier-list">`;
    earlierWork.forEach(job => {
      const startY = job.startDate ? job.startDate.slice(0, 4) : '';
      const endY = job.endDate ? job.endDate.slice(0, 4) : '';
      const era = startY === endY ? startY : `${startY}–${endY}`;
      html += `<div class="earlier-item">`;
      html += `<span class="earlier-date">${escape(era)}</span>`;
      html += `<span class="earlier-content"><strong>${escape(job.name)}</strong> — ${escape(job.position || '')}</span>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  // Skills
  if (skills.length) {
    html += `<h2 class="section-title">Skills</h2>`;
    html += `<div class="skills-list">`;
    skills.forEach(s => {
      html += `<div class="skill-row">`;
      html += `<span class="skill-label">${escape(s.name)}</span>`;
      if (s.keywords && s.keywords.length) {
        html += `<span class="skill-values">${s.keywords.map(k => escape(k)).join(', ')}</span>`;
      }
      html += `</div>`;
    });
    html += `</div>`;
  }

  // Education
  if (education.length) {
    html += `<h2 class="section-title">Education</h2>`;
    education.forEach(ed => {
      const startY = ed.startDate ? ed.startDate.slice(0, 4) : '';
      const endY = ed.endDate ? ed.endDate.slice(0, 4) : '';
      const era = startY === endY ? startY : `${startY}–${endY}`;
      html += `<div class="edu-item">`;
      html += `<span class="edu-date">${escape(era)}</span>`;
      html += `<span class="edu-content">${escape(ed.studyType || '')}, ${escape(ed.area || '')} — ${escape(ed.institution || '')}</span>`;
      html += `</div>`;
    });
  }

  // Recommendations (first 3)
  if (references.length) {
    html += `<h2 class="section-title">Recommendations</h2>`;
    references.forEach(ref => {
      const dateStr = ref.date ? new Date(ref.date + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
      const paragraphs = (ref.reference || '').split(/\n\n+/).map(p => `<p>${escape(p.trim())}</p>`).join('');
      html += `<div class="rec-item">`;
      html += `<div class="rec-meta"><div class="rec-name">${escape(ref.name || '')}</div><div class="rec-title">${escape(ref.title || '')}</div><div class="rec-date">${escape(dateStr)}</div></div>`;
      html += `<div class="rec-text">${paragraphs}</div>`;
      html += `</div>`;
    });
  }

  html += `<div class="cv-footer">Full recommendations available at <a href="https://www.linkedin.com/in/lazaryevyuriy/details/recommendations/">LinkedIn</a></div>`;

  html += `</body></html>`;
  return html;
}

export { render };
