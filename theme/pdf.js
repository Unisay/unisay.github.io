const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function formatDateRange(startDate, endDate) {
  if (!startDate) return '';
  const start = new Date(startDate + '-01');
  const end = endDate ? new Date(endDate + '-01') : null;
  const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (!endDate) return `${startStr} - Present`;
  const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return startStr;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${endStr}`;
  }
  return `${startStr} - ${endStr}`;
}

function formatShortDateRange(startDate, endDate) {
  if (!startDate) return '';
  const startYear = startDate.slice(0, 4);
  if (!endDate) return `${startYear}-Present`;
  const endYear = endDate.slice(0, 4);
  if (startYear === endYear) return startYear;
  return `${startYear}-${endYear}`;
}

function render(resume) {
  const basics = resume.basics || {};
  const work = resume.work || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const education = resume.education || [];
  const interests = resume.interests || [];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(basics.name || 'CV')}</title>
<style>
@page { size: A4; margin: 10mm 12mm; }

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: #ffffff;
  color: #111111;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 8.5pt;
  line-height: 1.15;
  widows: 3;
  orphans: 3;
}

/* ── Header ── */
.cv-header {
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid #111111;
}
h1.cv-name {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 20pt;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1;
  color: #111111;
}
.cv-tagline {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 10pt;
  font-weight: 400;
  color: #666666;
  margin-top: 4px;
  letter-spacing: 0.01em;
}
.cv-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 20px;
  margin-top: 5px;
  font-size: 9.5pt;
  color: #666666;
}
.cv-contact a { color: #666666; text-decoration: none; }
.cv-contact a:hover { color: #111111; }

/* ── Summary ── */
.cv-summary {
  font-size: 9.5pt;
  line-height: 1.35;
}

/* ── Section headings ── */
h2 {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 10.5pt;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #111111;
  border-bottom: 1px solid #cccccc;
  padding-bottom: 2px;
  margin: 8px 0 4px;
  break-after: avoid;
}

/* ── Experience ── */
.role {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  break-inside: avoid;
  margin-bottom: 2px;
}
.role + .role, .bullets + .role, .role-oneliner + .role {
  margin-top: 6px;
}
.role-company { font-weight: 600; font-size: 9.5pt; }
.role-company a { color: inherit; text-decoration: none; }
.role-title   { font-size: 8.5pt; color: #666666; margin-top: 0px; }
.role-dates   {
  font-size: 9pt;
  color: #999999;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  text-align: right;
  padding-top: 1px;
}

.bullets {
  margin: 2px 0 2px 18px;
}
.bullets li {
  margin-top: 0px;
  font-size: 8.5pt;
  line-height: 1.3;
}
.bullets a {
  color: #111111;
  text-decoration: underline;
  text-decoration-thickness: 0.5px;
  text-underline-offset: 2px;
}

.role-oneliner {
  font-size: 10.5pt;
  color: #666666;
  padding-left: 14px;
  margin-top: 2px;
}

.earlier {
  break-inside: avoid;
  margin-bottom: 6px;
}
.earlier-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.earlier-title { font-weight: 600; font-size: 11pt; }
.earlier-era   { font-size: 9pt; color: #999999; }
.earlier-companies {
  font-size: 10.5pt;
  color: #666666;
  padding-left: 14px;
  margin-top: 2px;
}

/* ── Skills ── */
.skills-list { display: block; }
.skill-row {
  display: flex;
  gap: 8px;
  font-size: 9pt;
  align-items: start;
  break-inside: avoid;
  margin-bottom: 1px;
}
.skill-label { font-weight: 600; width: 140px; flex-shrink: 0; }
.skill-values { color: #666666; }

/* ── Education ── */
.edu-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 11pt;
  margin-top: 4px;
  break-inside: avoid;
}
.edu-years {
  font-size: 10pt;
  color: #999999;
  font-variant-numeric: tabular-nums;
  width: 68px;
  flex-shrink: 0;
}
.edu-details { flex: 1; }
.edu-inst { color: #666666; text-align: right; }

/* ── Footer ── */
.cv-footer {
  margin-top: 12px;
  padding-top: 4px;
  border-top: 1px solid #cccccc;
  font-size: 9.5pt;
  color: #999999;
  text-align: center;
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
}
.cv-footer a {
  color: #999999;
  text-decoration: underline;
  text-decoration-thickness: 0.5px;
  text-underline-offset: 2px;
}

@media print {
  html, body { background: white; }
  h2 { break-after: avoid; }
  .role { break-inside: avoid; }
  .earlier { break-inside: avoid; }
}
</style>
</head>
<body>
`;

  // Header
  html += `<header class="cv-header">`;
  html += `<h1 class="cv-name">${escape(basics.name || '')}</h1>`;
  html += `<div class="cv-tagline">${escape(basics.label || '')}</div>`;
  html += `<div class="cv-contact">`;
  if (basics.email) {
    html += `<a href="mailto:${escape(basics.email)}">${escape(basics.email)}</a>`;
  }
  if (basics.profiles) {
    basics.profiles.forEach(p => {
      html += `<a href="${escape(p.url)}" target="_blank">${escape(p.url.replace(/^https?:\/\//, ''))}</a>`;
    });
  }
  html += `<a href="https://cv.functional.work" target="_blank">cv.functional.work</a>`;
  if (basics.location) {
    const loc = [basics.location.city, basics.location.region].filter(Boolean).join(', ');
    html += `<span>${escape(loc)}</span>`;
  }
  html += `</div></header>`;

  // Summary
  if (basics.summary) {
    html += `<p class="cv-summary">${escape(basics.summary).replace(/\n\n/g, '</p><p class="cv-summary">').replace(/\n/g, ' ')}</p>`;
  }

  // Experience
  if (work.length) {
    html += `<h2>Experience</h2>`;
    work.forEach(job => {
      html += `<div class="role">`;
      html += `<div>`;
      html += `<div class="role-company">${job.url ? `<a href="${escape(job.url)}" target="_blank">${escape(job.name)}</a>` : escape(job.name)}</div>`;
      html += `<div class="role-title">${escape(job.position || '')}</div>`;
      html += `</div>`;
      html += `<div class="role-dates">${escape(formatDateRange(job.startDate, job.endDate))}</div>`;
      html += `</div>`;

      if (job.highlights && job.highlights.length) {
        html += `<ul class="bullets">`;
        job.highlights.forEach(h => {
          html += `<li>${escape(h).replace(/\n\n/g, '</li><li>').replace(/\n/g, ' ')}</li>`;
        });
        html += `</ul>`;
      } else if (job.summary) {
        html += `<div class="role-oneliner">${escape(job.summary).replace(/\n\n/g, ' ').replace(/\n/g, ' ')}</div>`;
      }
    });
  }

  // Skills
  if (skills.length) {
    html += `<h2>Skills</h2>`;
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
    html += `<h2>Education</h2>`;
    education.forEach(ed => {
      html += `<div class="edu-row">`;
      html += `<span class="edu-years">${escape(formatShortDateRange(ed.startDate, ed.endDate))}</span>`;
      html += `<span class="edu-details">${escape(ed.studyType || '')}, ${escape(ed.area || '')}</span>`;
      html += `<span class="edu-inst">${escape(ed.institution || '')}</span>`;
      html += `</div>`;
    });
  }

  html += `<div class="cv-footer">Recommendations and references available at <a href="https://cv.functional.work">cv.functional.work</a> and <a href="https://www.linkedin.com/in/lazaryevyuriy/details/recommendations/">LinkedIn</a></div>`;

  html += `</body></html>`;
  return html;
}

export { render };
