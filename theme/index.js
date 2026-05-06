const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(resume) {
  const basics = resume.basics || {};
  const work = resume.work || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const education = resume.education || [];
  const certificates = resume.certificates || [];
  const interests = resume.interests || [];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(basics.name || 'CV')}</title>
<style>
body { font-family: -apple-system,BlinkMacSystemFont,"avenir next",avenir,helvetica,"helvetica neue",ubuntu,roboto,noto,"segoe ui",arial,sans-serif; padding: 2em; line-height: 1.4; font-size: 11pt; color: #222; max-width: 900px; margin: 0 auto; }
h1 { font-size: 2em; margin-bottom: 0.1em; }
h2 { font-size: 1.3em; margin-top: 1.5em; border-bottom: 1px solid #ddd; padding-bottom: 0.2em; }
h3 { font-size: 1.1em; margin: 1em 0 0.2em; }
h4 { font-size: 1em; margin: 0.8em 0 0.2em; color: #444; }
p, ul { margin: 0.3em 0; }
ul { padding-left: 1.5em; }
table { border-collapse: collapse; margin: 0.5em 0; }
td { padding: 0.15em 0.5em; vertical-align: top; }
td:first-child { font-weight: 600; white-space: nowrap; }
a { color: #0366d6; text-decoration: none; }
a:hover { text-decoration: underline; }
.job { margin-bottom: 1.2em; }
.job-meta { color: #555; font-size: 0.95em; margin-bottom: 0.3em; }
.keywords { font-size: 0.9em; color: #555; margin-top: 0.3em; }
.keywords strong { color: #222; }
.interest-item { margin-bottom: 0.8em; }
</style>
</head>
<body>
<h1>${escape(basics.name || '')}</h1>
<p style="font-size:1.2em; margin-top:0;"><strong>${escape(basics.label || '')}</strong></p>
`;

  // Contact
  if (basics.email || basics.location || basics.profiles) {
    html += `<table>`;
    if (basics.location) {
      const loc = [basics.location.city, basics.location.region, basics.location.countryCode].filter(Boolean).join(', ');
      html += `<tr><td>Location:</td><td>${escape(loc)}</td></tr>`;
    }
    if (basics.email) {
      html += `<tr><td>Email:</td><td><a href="mailto:${escape(basics.email)}">${escape(basics.email)}</a></td></tr>`;
    }
    if (basics.profiles) {
      basics.profiles.forEach(p => {
        html += `<tr><td>${escape(p.network)}:</td><td><a href="${escape(p.url)}">${escape(p.username)}</a></td></tr>`;
      });
    }
    html += `</table>`;
  }

  // Summary
  if (basics.summary) {
    html += `<h2>Summary</h2><p>${escape(basics.summary).replace(/\n\n/g, '</p><p>').replace(/\n/g, ' ')}</p>`;
  }

  // Work
  if (work.length) {
    html += `<h2>Work Experience</h2>`;
    work.forEach(job => {
      const dates = [job.startDate, job.endDate || 'present'].join(' – ');
      html += `<div class="job">`;
      html += `<h3>${escape(job.position || '')} @ ${job.url ? `<a href="${escape(job.url)}">${escape(job.name)}</a>` : escape(job.name)}</h3>`;
      html += `<div class="job-meta">${escape(dates)}</div>`;
      if (job.summary) {
        html += `<p>${escape(job.summary).replace(/\n\n/g, '</p><p>').replace(/\n/g, ' ')}</p>`;
      }
      if (job.highlights && job.highlights.length) {
        html += `<ul>`;
        job.highlights.forEach(h => {
          html += `<li>${escape(h).replace(/\n\n/g, '</li><li>').replace(/\n/g, ' ')}</li>`;
        });
        html += `</ul>`;
      }
      if (job.keywords && job.keywords.length) {
        html += `<div class="keywords"><strong>${job.keywords.join(', ')}</strong></div>`;
      }
      html += `</div>`;
    });
  }

  // Skills
  if (skills.length) {
    html += `<h2>Skills</h2>`;
    skills.forEach(s => {
      html += `<h4>${escape(s.name)}${s.level ? ` — ${escape(s.level)}` : ''}</h4>`;
      if (s.keywords && s.keywords.length) {
        html += `<p>${s.keywords.join(', ')}</p>`;
      }
    });
  }

  // Projects
  if (projects.length) {
    html += `<h2>Projects</h2>`;
    projects.forEach(p => {
      html += `<h4>${p.url ? `<a href="${escape(p.url)}">${escape(p.name)}</a>` : escape(p.name)}</h4>`;
      if (p.description) {
        html += `<p>${escape(p.description).replace(/\n\n/g, '</p><p>').replace(/\n/g, ' ')}</p>`;
      }
    });
  }

  // Interests
  if (interests.length) {
    html += `<h2>Interests</h2>`;
    interests.forEach(i => {
      html += `<div class="interest-item"><strong>${escape(i.name)}</strong>`;
      if (i.keywords && i.keywords.length) {
        html += `<p>${escape(i.keywords[0]).replace(/\n\n/g, '</p><p>').replace(/\n/g, ' ')}</p>`;
      }
      html += `</div>`;
    });
  }

  // Education
  if (education.length) {
    html += `<h2>Education</h2>`;
    education.forEach(ed => {
      const years = [ed.startDate, ed.endDate].filter(Boolean).join(' – ');
      html += `<p><strong>${escape(ed.studyType || '')}</strong>, ${escape(ed.area || '')}, ${escape(ed.institution || '')}${years ? ` (${escape(years)})` : ''}</p>`;
    });
  }

  // Certificates
  if (certificates.length) {
    html += `<h2>Certifications</h2>`;
    certificates.forEach(c => {
      html += `<p>${escape(c.name)}${c.issuer ? `, ${escape(c.issuer)}` : ''}${c.date ? ` (${escape(c.date)})` : ''}</p>`;
    });
  }

  html += `</body></html>`;
  return html;
}

export { render };
