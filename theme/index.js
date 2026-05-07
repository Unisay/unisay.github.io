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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: #ffffff;
  color: #1a1a1a;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 40px;
}

/* ── Header ── */
.cv-header {
  padding-bottom: 24px;
  margin-bottom: 20px;
}
.cv-name {
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.1;
  text-transform: uppercase;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}
.cv-tagline {
  font-size: 16px;
  font-weight: 500;
  color: #4a4a4a;
  margin: 8px 0 16px 0;
  letter-spacing: 0.3px;
}
.cv-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-top: 16px;
}
.cv-contact {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cv-contact a {
  color: #1a1a1a;
  text-decoration: none;
  font-size: 13px;
  position: relative;
  padding-bottom: 2px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cv-contact a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #1a1a1a;
  transition: width 0.2s ease;
}
.cv-contact a:hover::after { width: 100%; }
.cv-right-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}
.cv-location {
  font-size: 13px;
  color: #1a1a1a;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 2px;
}

/* ── Downloads ── */
.cv-downloads {
  display: flex;
  gap: 6px;
}
.cv-downloads a {
  display: inline-flex;
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.15s ease;
}
.cv-downloads a:hover {
  opacity: 1;
}

@media (max-width: 600px) {
  .cv-meta-row {
    flex-direction: column;
  }
  .cv-right-meta {
    align-items: flex-start;
  }
}

/* ── Summary ── */
.cv-summary {
  font-size: 15px;
  line-height: 1.6;
  color: #2a2a2a;
  margin: 0 0 32px 0;
}

/* ── Section headings ── */
.section-title {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #1a1a1a;
  margin: 40px 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #1a1a1a;
}
section:first-of-type .section-title {
  margin-top: 0;
}

/* ── Experience Grid ── */
.grid-item {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
}
.grid-item:last-child {
  border-bottom: none;
}
.meta-column {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 16px;
  border-right: 2px solid #e5e5e5;
}
.meta-date {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  font-variant-numeric: tabular-nums;
}
.meta-location {
  font-size: 12px;
  color: #6a6a6a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.content-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.2px;
  margin: 0;
}
.item-title a { color: inherit; text-decoration: none; }
.item-title a:hover { text-decoration: underline; }
.item-subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #4a4a4a;
}
.item-description {
  font-size: 14px;
  line-height: 1.6;
  color: #2a2a2a;
  margin: 4px 0 0 0;
}
.highlights-list {
  margin: 8px 0 0 0;
  padding-left: 20px;
  list-style: none;
}
.highlights-list li {
  position: relative;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.6;
}
.highlights-list li::before {
  content: '■';
  position: absolute;
  left: -20px;
  color: #1a1a1a;
  font-size: 8px;
  line-height: 1.6;
}

/* ── Skills ── */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.skill-category {
  padding: 12px;
  border: 2px solid #e5e5e5;
}
.skill-category h4 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
  color: #1a1a1a;
}
.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.badge {
  font-size: 12px;
  padding: 3px 10px;
  background: #ffffff;
  border: 1px solid #d0d0d0;
  color: #2a2a2a;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* ── Education ── */
.edu-grid {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}
.edu-grid:last-child { border-bottom: none; }

/* ── Projects more link ── */
.projects-more {
  margin-top: 16px;
  font-size: 13px;
  color: #9a9a9a;
}
.projects-more a {
  color: #9a9a9a;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.projects-more a:hover {
  color: #1a1a1a;
}

/* ── Interests ── */
.interests-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.interest-item {
  padding: 12px;
  border-left: 3px solid #e5e5e5;
  background: #fafafa;
}
.interest-item h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 6px 0;
}
.interest-item p {
  font-size: 14px;
  color: #4a4a4a;
  margin: 0;
}

/* ── Projects ── */
.projects-grid .grid-item {
  grid-template-columns: 1fr;
  gap: 0;
  margin-bottom: 24px;
  padding-bottom: 24px;
}
.projects-grid .grid-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.projects-grid .meta-column {
  display: none;
}

@media (max-width: 768px) {
  .container { padding: 32px 20px; }
  .cv-name { font-size: 32px; }
  .grid-item,
  .edu-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .meta-column {
    border-right: none;
    border-bottom: 2px solid #e5e5e5;
    padding-right: 0;
    padding-bottom: 8px;
  }
  .skills-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Recommendations ── */
.rec-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.rec-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
}
.rec-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.rec-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 16px;
  border-right: 2px solid #e5e5e5;
}
.rec-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}
.rec-title {
  font-size: 12px;
  color: #6a6a6a;
  line-height: 1.4;
}
.rec-date {
  font-size: 11px;
  color: #999999;
  font-variant-numeric: tabular-nums;
}
.rec-text {
  font-size: 14px;
  line-height: 1.6;
  color: #2a2a2a;
}
.rec-text p {
  margin-bottom: 8px;
}
.rec-text p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .rec-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .rec-meta {
    border-right: none;
    border-bottom: 2px solid #e5e5e5;
    padding-right: 0;
    padding-bottom: 8px;
  }
}
</style>
</head>
<body>
<div class="container">
`;

  const emailIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
  const globeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  const githubIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
  const linkedinIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`;
  const locationIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const jsonIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#1a1a1a" width="32" height="32" viewBox="0 0 58 58"><g><path d="M50.949,12.187l-1.361-1.361l-9.504-9.505c-0.001-0.001-0.001-0.001-0.002-0.001l-0.77-0.771C38.957,0.195,38.486,0,37.985,0H8.963C7.776,0,6.5,0.916,6.5,2.926V39v16.537V56c0,0.837,0.841,1.652,1.836,1.909c0.051,0.014,0.1,0.033,0.152,0.043C8.644,57.983,8.803,58,8.963,58h40.074c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.101-0.029,0.152-0.043C50.659,57.652,51.5,56.837,51.5,56v-0.463V39V13.978C51.5,13.211,51.407,12.644,50.949,12.187z M39.5,3.565L47.935,12H39.5V3.565z M8.963,56c-0.071,0-0.135-0.025-0.198-0.049C8.61,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.11,0.34-0.265,0.414C49.172,55.975,49.108,56,49.037,56H8.963z M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V13.78c-0.532-0.48-1.229-0.78-2-0.78c-0.553,0-1,0.448-1,1s0.447,1,1,1c0.552,0,1,0.449,1,1v4c0,1.2,0.542,2.266,1.382,3c-0.84,0.734-1.382,1.8-1.382,3v4c0,0.551-0.448,1-1,1c-0.553,0-1,0.448-1,1s0.447,1,1,1c1.654,0,3-1.346,3-3v-4c0-1.103,0.897-2,2-2c0.553,0,1-0.448,1-1s-0.447-1-1-1c-1.103,0-2-0.897-2-2v-4c0-0.771-0.301-1.468-0.78-2h11.389c0.135,0,0.265-0.025,0.391-0.058c0,0.015,0.001,0.021,0.001,0.036V39H8.5z"/><path d="M16.354,51.43c-0.019,0.446-0.171,0.764-0.458,0.95s-0.672,0.28-1.155,0.28c-0.191,0-0.396-0.022-0.615-0.068s-0.429-0.098-0.629-0.157s-0.385-0.123-0.554-0.191s-0.299-0.135-0.39-0.198l-0.697,1.107c0.183,0.137,0.405,0.26,0.67,0.369s0.54,0.207,0.827,0.294s0.565,0.15,0.834,0.191s0.504,0.062,0.704,0.062c0.401,0,0.791-0.039,1.169-0.116c0.378-0.077,0.713-0.214,1.005-0.41s0.524-0.456,0.697-0.779s0.26-0.723,0.26-1.196v-7.848h-1.668V51.43z"/><path d="M25.083,49.064c-0.314-0.228-0.654-0.422-1.019-0.581s-0.702-0.323-1.012-0.492s-0.569-0.364-0.779-0.588s-0.314-0.518-0.314-0.882c0-0.146,0.036-0.299,0.109-0.458s0.173-0.303,0.301-0.431s0.273-0.234,0.438-0.321s0.337-0.139,0.52-0.157c0.328-0.027,0.597-0.032,0.807-0.014s0.378,0.05,0.506,0.096s0.226,0.091,0.294,0.137s0.13,0.082,0.185,0.109c0.009-0.009,0.036-0.055,0.082-0.137s0.101-0.185,0.164-0.308s0.132-0.255,0.205-0.396s0.137-0.271,0.191-0.39c-0.265-0.173-0.61-0.299-1.039-0.376s-0.853-0.116-1.271-0.116c-0.41,0-0.8,0.063-1.169,0.191s-0.692,0.313-0.971,0.554s-0.499,0.535-0.663,0.882S20.4,46.13,20.4,46.576c0,0.492,0.104,0.902,0.314,1.23s0.474,0.613,0.793,0.854s0.661,0.451,1.025,0.629s0.704,0.355,1.019,0.533s0.576,0.376,0.786,0.595s0.314,0.483,0.314,0.793c0,0.511-0.148,0.896-0.444,1.155s-0.723,0.39-1.278,0.39c-0.183,0-0.378-0.019-0.588-0.055s-0.419-0.084-0.629-0.144s-0.412-0.123-0.608-0.191s-0.357-0.139-0.485-0.212l-0.287,1.176c0.155,0.137,0.34,0.253,0.554,0.349s0.439,0.171,0.677,0.226c0.237,0.055,0.472,0.094,0.704,0.116s0.458,0.034,0.677,0.034c0.511,0,0.966-0.077,1.367-0.232s0.738-0.362,1.012-0.622s0.485-0.561,0.636-0.902s0.226-0.695,0.226-1.06c0-0.538-0.104-0.978-0.314-1.319S25.397,49.292,25.083,49.064z"/><path d="M34.872,45.072c-0.378-0.429-0.82-0.754-1.326-0.978s-1.06-0.335-1.661-0.335s-1.155,0.111-1.661,0.335s-0.948,0.549-1.326,0.978s-0.675,0.964-0.889,1.606s-0.321,1.388-0.321,2.235s0.107,1.595,0.321,2.242s0.511,1.185,0.889,1.613s0.82,0.752,1.326,0.971s1.06,0.328,1.661,0.328s1.155-0.109,1.661-0.328s0.948-0.542,1.326-0.971s0.675-0.966,0.889-1.613s0.321-1.395,0.321-2.242s-0.107-1.593-0.321-2.235S35.25,45.501,34.872,45.072z M34.195,50.698c-0.137,0.487-0.326,0.882-0.567,1.183s-0.515,0.518-0.82,0.649s-0.627,0.198-0.964,0.198c-0.328,0-0.641-0.07-0.937-0.212s-0.561-0.364-0.793-0.67s-0.415-0.699-0.547-1.183s-0.203-1.066-0.212-1.75c0.009-0.702,0.082-1.294,0.219-1.777c0.137-0.483,0.326-0.877,0.567-1.183s0.515-0.521,0.82-0.649s0.627-0.191,0.964-0.191c0.328,0,0.641,0.068,0.937,0.205s0.561,0.36,0.793,0.67s0.415,0.704,0.547,1.183s0.203,1.06,0.212,1.743C34.405,49.616,34.332,50.211,34.195,50.698z"/><polygon points="44.012,50.869 40.061,43.924 38.393,43.924 38.393,54 40.061,54 40.061,47.055 44.012,54 45.68,54 45.68,43.924 44.012,43.924"/><path d="M20.5,20v-4c0-0.551,0.448-1,1-1c0.553,0,1-0.448,1-1s-0.447-1-1-1c-1.654,0-3,1.346-3,3v4c0,1.103-0.897,2-2,2c-0.553,0-1,0.448-1,1s0.447,1,1,1c1.103,0,2,0.897,2,2v4c0,1.654,1.346,3,3,3c0.553,0,1-0.448,1-1s-0.447-1-1-1c-0.552,0-1-0.449-1-1v-4c0-1.2-0.542-2.266-1.382-3C19.958,22.266,20.5,21.2,20.5,20z"/><circle cx="28.5" cy="19.5" r="1.5"/><path d="M28.5,25c-0.553,0-1,0.448-1,1v3c0,0.552,0.447,1,1,1s1-0.448,1-1v-3C29.5,25.448,29.053,25,28.5,25z"/></g></svg>`;
  const pdfIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#1a1a1a" width="32" height="32" viewBox="0 0 58 58"><g><path d="M50.95,12.187l-0.771-0.771L40.084,1.321L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963C7.777,0,6.5,0.916,6.5,2.926V39v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042C8.644,57.983,8.803,58,8.963,58h40.074c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.1-0.029,0.15-0.042C50.658,57.653,51.5,56.837,51.5,56v-0.463V39V13.978C51.5,13.211,51.408,12.645,50.95,12.187z M47.935,12H39.5V3.565L47.935,12z M8.963,56c-0.071,0-0.135-0.026-0.198-0.049C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.109,0.339-0.265,0.414C49.172,55.974,49.108,56,49.037,56H8.963z M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V14h11.609c0.135,0,0.264-0.025,0.39-0.058c0,0.015,0.001,0.021,0.001,0.036V39H8.5z"/><path d="M22.042,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388c0-0.483-0.103-0.918-0.308-1.306S22.375,45.018,22.042,44.744z M21.42,48.073c-0.101,0.278-0.232,0.494-0.396,0.649c-0.164,0.155-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567C21.57,47.451,21.52,47.795,21.42,48.073z"/><path d="M31.954,45.4c-0.424-0.446-0.957-0.805-1.6-1.073s-1.388-0.403-2.235-0.403h-3.035V54h3.814c0.127,0,0.323-0.016,0.588-0.048c0.264-0.032,0.556-0.104,0.875-0.219c0.319-0.114,0.649-0.285,0.991-0.513s0.649-0.54,0.923-0.937s0.499-0.889,0.677-1.477s0.267-1.297,0.267-2.126c0-0.602-0.105-1.188-0.314-1.757C32.694,46.355,32.378,45.847,31.954,45.4z M30.758,51.73c-0.492,0.711-1.294,1.066-2.406,1.066h-1.627v-7.629h0.957c0.784,0,1.422,0.103,1.914,0.308s0.882,0.474,1.169,0.807s0.48,0.704,0.581,1.114c0.1,0.41,0.15,0.825,0.15,1.244C31.496,49.989,31.25,51.02,30.758,51.73z"/><polygon points="35.598,54 37.266,54 37.266,49.461 41.477,49.461 41.477,48.34 37.266,48.34 37.266,45.168 41.9,45.168 41.9,43.924 35.598,43.924"/><path d="M38.428,22.961c-0.919,0-2.047,0.12-3.358,0.358c-1.83-1.942-3.74-4.778-5.088-7.562c1.337-5.629,0.668-6.426,0.373-6.802c-0.314-0.4-0.757-1.049-1.261-1.049c-0.211,0-0.787,0.096-1.016,0.172c-0.576,0.192-0.886,0.636-1.134,1.215c-0.707,1.653,0.263,4.471,1.261,6.643c-0.853,3.393-2.284,7.454-3.788,10.75c-3.79,1.736-5.803,3.441-5.985,5.068c-0.066,0.592,0.074,1.461,1.115,2.242c0.285,0.213,0.619,0.326,0.967,0.326h0c0.875,0,1.759-0.67,2.782-2.107c0.746-1.048,1.547-2.477,2.383-4.251c2.678-1.171,5.991-2.229,8.828-2.822c1.58,1.517,2.995,2.285,4.211,2.285c0.896,0,1.664-0.412,2.22-1.191c0.579-0.811,0.711-1.537,0.39-2.16C40.943,23.327,39.994,22.961,38.428,22.961z M20.536,32.634c-0.468-0.359-0.441-0.601-0.431-0.692c0.062-0.556,0.933-1.543,3.07-2.744C21.555,32.19,20.685,32.587,20.536,32.634z M28.736,9.712c0.043-0.014,1.045,1.101,0.096,3.216C27.406,11.469,28.638,9.745,28.736,9.712z M26.669,25.738c1.015-2.419,1.959-5.09,2.674-7.564c1.123,2.018,2.472,3.976,3.822,5.544C31.031,24.219,28.759,24.926,26.669,25.738z M39.57,25.259C39.262,25.69,38.594,25.7,38.36,25.7c-0.533,0-0.732-0.317-1.547-0.944c0.672-0.086,1.306-0.108,1.811-0.108c0.889,0,1.052,0.131,1.175,0.197C39.777,24.916,39.719,25.05,39.57,25.259z"/></g></svg>`;


  // Header
  html += `<header class="cv-header">`;
  html += `<h1 class="cv-name">${escape(basics.name || '')}</h1>`;
  html += `<div class="cv-tagline">${escape(basics.label || '')}</div>`;
  if (basics.summary) {
    html += `<p class="cv-summary">${escape(basics.summary).replace(/\n\n/g, '</p><p class="cv-summary">').replace(/\n/g, ' ')}</p>`;
  }
  html += `<div class="cv-meta-row">`;

  html += `<div class="cv-contact">`;
  if (basics.email) {
    html += `<a href="mailto:${escape(basics.email)}">${emailIcon}${escape(basics.email)}</a>`;
  }
  html += `<a href="https://cv.functional.work" target="_blank">${globeIcon}cv.functional.work</a>`;
  if (basics.profiles) {
    basics.profiles.forEach(p => {
      const icon = p.network && p.network.toLowerCase() === 'github' ? githubIcon : linkedinIcon;
      html += `<a href="${escape(p.url)}" target="_blank">${icon}${escape(p.url.replace(/^https?:\/\//, ''))}</a>`;
    });
  }
  if (basics.location) {
    const loc = [basics.location.city, basics.location.region].filter(Boolean).join(', ');
    html += `<span class="cv-location">${locationIcon}${escape(loc)} | Remote</span>`;
  }
  html += `</div>`;

  html += `<div class="cv-right-meta">`;
  html += `<div class="cv-downloads">`;
  html += `<a href="resume.pdf" download title="Download PDF">${pdfIconSvg}</a>`;
  html += `<a href="resume.json" download title="Download JSON">${jsonIconSvg}</a>`;
  html += `</div>`;
  html += `</div>`;

  html += `</div>`;
  html += `</header>`;

  // Experience
  if (work.length) {
    html += `<section><h2 class="section-title">Experience</h2>`;
    work.forEach(job => {
      html += `<div class="grid-item">`;
      html += `<div class="meta-column">`;
      html += `<div class="meta-date">${escape(formatDateRange(job.startDate, job.endDate))}</div>`;
      if (job.location) {
        html += `<div class="meta-location">${escape(job.location)}</div>`;
      }
      html += `</div>`;
      html += `<div class="content-column">`;
      html += `<h3 class="item-title">${job.url ? `<a href="${escape(job.url)}" target="_blank">${escape(job.name)}</a>` : escape(job.name)}</h3>`;
      html += `<div class="item-subtitle">${escape(job.position || '')}</div>`;
      if (job.summary) {
        html += `<p class="item-description">${escape(job.summary).replace(/\n\n/g, ' ').replace(/\n/g, ' ')}</p>`;
      }
      if (job.highlights && job.highlights.length) {
        html += `<ul class="highlights-list">`;
        job.highlights.forEach(h => {
          html += `<li>${escape(h).replace(/\n\n/g, '</li><li>').replace(/\n/g, ' ')}</li>`;
        });
        html += `</ul>`;
      }
      html += `</div></div>`;
    });
    html += `</section>`;
  }

  // Skills
  if (skills.length) {
    html += `<section><h2 class="section-title">Skills</h2>`;
    html += `<div class="skills-grid">`;
    skills.forEach(s => {
      html += `<div class="skill-category">`;
      html += `<h4>${escape(s.name)}</h4>`;
      if (s.keywords && s.keywords.length) {
        html += `<div class="badge-list">`;
        s.keywords.forEach(k => {
          html += `<span class="badge">${escape(k)}</span>`;
        });
        html += `</div>`;
      }
      html += `</div>`;
    });
    html += `</div></section>`;
  }

  // Projects
  if (projects.length) {
    html += `<section><h2 class="section-title">Projects</h2>`;
    html += `<div class="projects-grid">`;
    projects.forEach(project => {
      html += `<div class="grid-item">`;
      html += `<div class="meta-column">`;
      if (project.startDate || project.endDate) {
        html += `<div class="meta-date">${escape(formatDateRange(project.startDate, project.endDate))}</div>`;
      }
      if (project.type) {
        html += `<div class="meta-location">${escape(project.type)}</div>`;
      }
      html += `</div>`;
      html += `<div class="content-column">`;
      html += `<h3 class="item-title">${project.url ? `<a href="${escape(project.url)}" target="_blank">${escape(project.name)}</a>` : escape(project.name)}</h3>`;
      if (project.description) {
        html += `<p class="item-description">${escape(project.description).replace(/\n\n/g, ' ').replace(/\n/g, ' ')}</p>`;
      }
      if (project.highlights && project.highlights.length) {
        html += `<ul class="highlights-list">`;
        project.highlights.forEach(h => {
          html += `<li>${escape(h).replace(/\n\n/g, '</li><li>').replace(/\n/g, ' ')}</li>`;
        });
        html += `</ul>`;
      }
      html += `</div></div>`;
    });
    html += `</div>`;
    const ghUser = basics.profiles && basics.profiles.find(p => p.network && p.network.toLowerCase() === 'github');
    if (ghUser) {
      html += `<p class="projects-more">More open-source work on <a href="${escape(ghUser.url)}?tab=repositories" target="_blank">GitHub</a>.</p>`;
    }
    html += `</section>`;
  }

  // Education
  if (education.length) {
    html += `<section><h2 class="section-title">Education</h2>`;
    education.forEach(ed => {
      html += `<div class="edu-grid">`;
      html += `<div class="meta-column">`;
      html += `<div class="meta-date">${escape(formatShortDateRange(ed.startDate, ed.endDate))}</div>`;
      html += `</div>`;
      html += `<div class="content-column">`;
      html += `<h3 class="item-title">${escape(ed.institution || '')}</h3>`;
      html += `<div class="item-subtitle">${escape(ed.studyType || '')}${ed.area ? ` in ${escape(ed.area)}` : ''}</div>`;
      html += `</div></div>`;
    });
    html += `</section>`;
  }

  // Recommendations
  html += `<section><h2 class="section-title">Recommendations</h2><div class="rec-grid">`;

  html += `<div class="rec-item"><div class="rec-meta"><div class="rec-name">Christopher Coffey</div><div class="rec-title">CTO @ CollegeVine</div><div class="rec-date">June 2019</div></div><div class="rec-text"><p>When we extended our offer to Yuriy, he responded saying that CollegeVine's contract with Alan Turing was signed. While it turned out that this happened to be the name of the agency through which we were working, his sense of humor and zeal for writing quality software were apparent from day 1. Over the course of his time at CollegeVine Yuriy did very high-quality work. He made a major impact spinning up several new Haskell services from scratch, as well as several critical features in our UI. He was never afraid to venture into whichever part of the system we needed him in, and pretty much always left it better than he found it.</p><p>He's been writing software for a long time, and that experience is apparent in Yuriy's ability to introduce positive change to teams. He was never afraid to share opinions and suggestions for improvement, most of which were adopted by the team. One particularly impressive bit of work was a property-based integration testing framework built upon Selenium, which we used to immediately protect a critical workflow for the company.</p><p>If you're looking to start up a new engineering team or add a highly effective team member to an existing team, Yuriy is a great choice! I'd be thrilled to work with him again in the future.</p></div></div>`;

  html += `<div class="rec-item"><div class="rec-meta"><div class="rec-name">Eric Torreborre</div><div class="rec-title">Senior Software Engineer (Rust, Haskell, Scala)</div><div class="rec-date">June 2019</div></div><div class="rec-text"><p>I worked with Yuriy at Zalando, in the Merchant Operations department. You cannot make a mistake by deciding to work with Yuriy because he is curious, dedicated and very thorough. I was also the witness of Yuriy's growing love for Functional Programming, using various languages, like Haskell, Purescript, Scala and he is now a very skilled person in that domain, capable of delivering reliable and maintainable systems. On the personal side, he is pleasant to work with, always constructive and a team player. In one icon 💯.</p></div></div>`;

  html += `<div class="rec-item"><div class="rec-meta"><div class="rec-name">Patrice Moore</div><div class="rec-title">Full Stack Software Engineering Manager</div><div class="rec-date">February 2013</div></div><div class="rec-text"><p>Yuriy was amazing. I have hired numerous developers, both in person and through odesk. Yuriy was one of the best. He started working on adding significant features, took responsibility for crafting solutions to technical issues with only minimal direction.</p><p>Yuriy reachitected portions of FarReaches wordpress plugin to remove significant technical debt, created and improved significant parts of our automated testing framework, and created an eventbus that allows the browser javascript UI and the PHP wordpress plugin to communicate in an elegant, extensible manner.</p></div></div>`;

  html += `<div class="rec-item"><div class="rec-meta"><div class="rec-name">Bartlomiej Nagorski</div><div class="rec-title">Delivery Manager & Job Family Lead at GFT</div><div class="rec-date">December 2012</div></div><div class="rec-text"><p>Yuriy is highly proficient developer with extensive programming knowledge that covers development, testing and a huge number of frameworks and libraries. He is also familiar with different software development methodologies, which has proved to be very useful in his team lead role. Yuriy has been able to propose a number of technical solutions and process improvements to our clients, as well as organise work for the team and mentor his less experienced colleagues.</p><p>I am recommending Yuriy, because he is a team player, a good colleague and an expert in software development.</p></div></div>`;

  html += `</div></section>`;

  // Interests
  if (interests.length) {
    html += `<section><h2 class="section-title">Interests</h2>`;
    html += `<div class="interests-list">`;
    interests.forEach(interest => {
      html += `<div class="interest-item">`;
      html += `<h4>${escape(interest.name)}</h4>`;
      if (interest.keywords && interest.keywords.length) {
        html += `<p>${interest.keywords.map(k => escape(k)).join(', ')}</p>`;
      }
      html += `</div>`;
    });
    html += `</div></section>`;
  }

  html += `</div></body></html>`;
  return html;
}

export { render };
