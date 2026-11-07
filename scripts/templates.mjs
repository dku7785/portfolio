const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
));
const url = (path, base) => escape(path.startsWith('https://') ? path : base + path);
const arrow = '<span aria-hidden="true">↗</span>';
const external = (href, label, classes = 'text-link') =>
  `<a class="${classes}" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(label)} ${arrow}</a>`;
const tags = (values) => values?.length ? `<ul class="tags" aria-label="Technologies">${values.map((v) => `<li>${escape(v)}</li>`).join('')}</ul>` : '';
const standardCategories = { game: 'Games', software: 'Software' };
const categoryLabel = (item) => item.categoryLabel ?? standardCategories[item.category] ?? item.category.replaceAll('-', ' ');
const nav = [['Home', 'index.html'], ['Projects', 'projects/index.html'], ['About', 'about/index.html'], ['Contact', 'contact/index.html']];

export function page(site, title, base, body, description = 'Game development portfolio by Kyungwon Lee.', section = title) {
  const documentTitle = title === 'Home' ? `${site.name} · Game Developer` : `${title} · ${site.name}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#121016">
  <title>${escape(documentTitle)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="icon" href="${base}assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${base}assets/site.css">
  <script src="${base}assets/site.js" defer></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap nav-bar">
      <a href="${base}index.html" class="brand" aria-label="${escape(site.name)} home"><img src="${base}assets/mark.svg" width="30" height="30" alt=""><span>KL <i>/</i> GAME DEV</span></a>
      <nav aria-label="Main navigation">${nav.map(([name, href]) => `<a href="${base}${href}"${section === name ? ' aria-current="page"' : ''}>${name}</a>`).join('')}</nav>
    </div>
  </header>
  <main id="main" class="wrap">${body}</main>
  <footer class="wrap site-footer"><span>© ${new Date().getFullYear()} ${escape(site.name)}</span><div>
    ${site.github ? external(site.github, 'GitHub') : ''}
    ${site.linkedin ? external(site.linkedin, 'LinkedIn') : ''}
    <a class="text-link" href="${base}contact/index.html">Contact <span aria-hidden="true">→</span></a>
  </div></footer>
</body>
</html>`;
}

function portrait(site, base) {
  if (!site.photo) return '';
  return `<figure class="portrait"><img src="${url(site.photo, base)}" alt="${escape(site.photoAlt)}" width="960" height="1280"><figcaption>KYUNGWON LEE <span aria-hidden="true">/</span> PROFILE</figcaption></figure>`;
}

function card(game, base) {
  const href = `${base}projects/${escape(game.slug)}/index.html`;
  return `<article class="project-card" data-category="${escape(game.category)}">
    <a href="${href}" class="project-cover ${escape(game.slug)}" tabindex="-1" aria-hidden="true">
      ${game.cover ? `<img src="${url(game.cover, base)}" alt="" width="960" height="540" loading="lazy">` : '<span class="empty-cover">PROJECT PREVIEW</span>'}
      <span class="cover-index">${game.number ? `${escape(game.number)} / ` : ''}${escape(categoryLabel(game))}</span>
    </a>
    <div class="card-body">
      ${game.type || game.status ? `<div class="card-meta"><span>${escape(game.type)}</span><span>${escape(game.status)}</span></div>` : ''}
      <h3><a href="${href}">${escape(game.title)}</a></h3>
      <p>${escape(game.description)}</p>
      ${game.role ? `<p class="card-role">${escape(game.role)}</p>` : ''}
      ${tags(game.tags)}
      <a class="button card-action" href="${href}" aria-label="Explore ${escape(game.title)}">Explore project <span aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

export function home(site, games) {
  const featured = games.some((item) => item.featured !== undefined)
    ? games.filter((item) => item.featured) : games.slice(0, 2);
  return `<section class="home-hero${site.photo ? '' : ' no-photo'}">
    <div class="hero-copy">
      <p class="eyebrow"><span>01</span> / Player profile</p>
      <h1>${escape(site.name)}<span class="cursor" aria-hidden="true">_</span></h1>
      <p class="hero-headline">${escape(site.headline)}</p>
      <p class="lede">${escape(site.intro)}</p>
      <ul class="tags loadout" aria-label="Tools I use"><li>C++ / Primary</li><li>Unity / Learning</li><li>C# / Learning</li></ul>
      <div class="actions"><a class="button primary" href="#selected">Explore projects <span aria-hidden="true">↓</span></a><a class="button" href="about/index.html">About me <span aria-hidden="true">→</span></a></div>
    </div>${portrait(site, './')}
  </section>
  <section class="selection" id="selected" aria-labelledby="featured-title">
    <div class="rail"><h2 id="featured-title"><span>02</span> / Select a project</h2><a class="text-link" href="projects/index.html">All projects <span aria-hidden="true">→</span></a></div>
    <div class="project-grid">${featured.map((game) => card(game, './')).join('')}</div>
  </section>
  <section class="next-chapter"><div><p class="eyebrow"><span>03</span> / Next chapter</p><h2>Keep learning. Keep building.</h2><p>I'm working toward a career in game development while building personal and indie projects.</p></div><a class="button" href="contact/index.html">Get in touch ${arrow}</a></section>`;
}

export function projects(games) {
  const categories = new Map(Object.entries(standardCategories));
  for (const item of games) categories.set(item.category, categoryLabel(item));
  const filters = [...categories].map(([key, label]) => `<button type="button" aria-pressed="false" data-filter="${escape(key)}">${escape(label)}</button>`).join('');
  return `<section class="page-intro"><p class="eyebrow">Project index</p><h1>Projects<span class="cursor" aria-hidden="true">_</span></h1><p class="lede">Gameplay experiments, level design, and programming projects.</p></section>
  <div class="filter-bar" hidden><div role="group" aria-label="Filter projects" class="filters"><button type="button" aria-pressed="true" data-filter="all">All</button>${filters}</div><span class="eyebrow" data-count aria-live="polite"></span></div>
  <div class="project-grid" id="project-list">${games.map((game) => card(game, '../')).join('')}</div>
  <div class="empty-state" hidden><h2>No projects in this category yet.</h2><p>Browse the full project list.</p><button class="button" type="button" data-reset-filter>Show all projects</button></div>`;
}

function gallery(images, base, label) {
  if (!images?.length) return '';
  return `<div class="gallery" aria-label="${escape(label)}">${images.map((image) => `
    <figure><a href="${url(image.src, base)}" data-gallery data-caption="${escape(image.label)}" aria-label="Enlarge ${escape(image.label)}">
      <img src="${url(image.src, base)}" alt="${escape(image.alt)}" loading="lazy" decoding="async">
      <span class="expand" aria-hidden="true">↗</span></a><figcaption>${escape(image.label)}</figcaption></figure>`).join('')}</div>`;
}

function playPanel(game, base) {
  if (!game.play && !game.download) return '';
  const play = game.play;
  const embed = play?.mode === 'embed';
  return `<section class="detail-section play-panel" id="play" aria-labelledby="play-title">
    <div class="play-head"><div><p class="eyebrow">${escape(game.status)}</p><h2 id="play-title">${play ? 'Play the game' : 'Downloads'}</h2></div>
      <div class="actions">${play ? (embed ? `<button class="button primary" data-launch="${url(play.url, base)}" data-game="${escape(game.title)}" type="button" aria-controls="game-frame" aria-expanded="false" hidden>Play in browser <span aria-hidden="true">▶</span></button><a class="button standalone" href="${url(play.url, base)}" target="_blank" rel="noopener noreferrer">Open game in new tab ${arrow}</a>` : external(play.url, 'Play in browser', 'button primary')) : ''}
      ${game.download ? `<a class="button" href="${url(game.download.url, base)}" download>${escape(game.download.label)} <span aria-hidden="true">↓</span></a>` : ''}</div>
    </div>
    ${play?.note ? `<p class="muted">${escape(play.note)}</p>` : ''}
    ${game.download?.note ? `<p class="muted">${escape(game.download.note)}</p>` : ''}
    ${embed ? `<div class="game-frame" id="game-frame" hidden><div class="frame-toolbar"><span class="eyebrow">Unity Web / ${escape(game.title)}</span><button class="button small" type="button" data-stop>Close game <span aria-hidden="true">×</span></button></div><div data-frame-slot></div></div>` : ''}
    ${game.controls?.length ? `<details class="controls"><summary>Keyboard controls</summary><dl>${game.controls.map(([key, action]) => `<div><dt><kbd>${escape(key)}</kbd></dt><dd>${escape(action)}</dd></div>`).join('')}</dl></details>` : ''}
  </section>`;
}

export function project(game) {
  const base = '../../';
  const facts = [['Format', game.type], ['Role', game.role], ['Status', game.status]].filter(([, value]) => value);
  const links = [...(game.links ?? [])];
  if (game.source) links.unshift({ label: 'View source', url: game.source });
  const hasImages = game.gallery?.length || game.stages?.some((stage) => stage.images?.length);
  const video = game.video;
  return `<section class="page-intro detail-intro">
    <a class="text-link back-link" href="../index.html"><span aria-hidden="true">←</span> All projects</a>
    <p class="eyebrow">${game.number ? `${escape(game.number)} / ` : ''}${escape(game.genre ?? categoryLabel(game))}</p>
    <h1>${escape(game.title)}</h1><p class="lede">${escape(game.description)}</p>
    ${game.play || game.download || links.length ? `<div class="actions">${game.play || game.download ? `<a class="button primary" href="#play">${game.play ? 'Play &amp; downloads' : 'Downloads'} <span aria-hidden="true">↓</span></a>` : ''}
    ${links.map(({ url: link, label }) => external(link.startsWith('https://') ? link : base + link, label, 'button')).join('')}</div>` : ''}
  </section>
  <section class="project-summary${game.cover ? '' : ' text-only'}" aria-label="Project overview">
    ${game.cover ? `<div class="detail-cover ${escape(game.slug)}"><img src="${url(game.cover, base)}" alt="${escape(game.coverAlt)}" width="960" height="540"></div>` : ''}
    <div class="fact-panel"><p class="eyebrow">Project brief</p><p>${escape(game.overview ?? game.description)}</p>${facts.length ? `<dl>${facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>` : ''}${tags(game.tags)}</div>
  </section>
  ${playPanel(game, base)}
  ${game.contributions?.length ? `<section class="detail-section" aria-labelledby="work-title"><p class="eyebrow">Development</p><h2 id="work-title">${escape(game.contributionsTitle ?? 'What I built')}</h2><div class="contribution-grid">${game.contributions.map(({ title, text }, index) => `<article class="contribution"><span class="eyebrow">${String(index + 1).padStart(2, '0')}</span><h3>${escape(title)}</h3><p>${escape(text)}</p></article>`).join('')}</div></section>` : ''}
  ${game.stages?.length ? `<section class="detail-section" aria-labelledby="stages-title"><p class="eyebrow">Level design</p><h2 id="stages-title">${escape(game.stagesTitle ?? 'Stages')}</h2><div class="stage-list">${game.stages.map((stage) => `<article class="stage"><p class="eyebrow">${escape(stage.name)}</p><h3>${escape(stage.title)}</h3><p>${escape(stage.text)}</p>${gallery(stage.images, base, stage.name)}</article>`).join('')}</div></section>` : ''}
  ${video ? `<section class="detail-section"><h2>${escape(video.title ?? 'Project video')}</h2><video class="project-video" src="${url(video.src, base)}" controls preload="none" playsinline>${video.captions ? `<track kind="captions" src="${url(video.captions, base)}" srclang="en" label="English">` : ''}</video></section>` : ''}
  ${game.gallery?.length ? `<section class="detail-section" aria-labelledby="gallery-title"><p class="eyebrow">From the build</p><h2 id="gallery-title">${game.category === 'game' ? 'Gameplay gallery' : 'Project screenshots'}</h2>${gallery(game.gallery, base, 'Project screenshots')}</section>` : ''}
  ${game.reference ? `<p class="source-link">${external(game.reference, 'Original course portfolio')}</p>` : ''}
  ${hasImages ? '<dialog id="screenshot-viewer" aria-label="Project screenshot"><form method="dialog"><button class="button small" aria-label="Close image">Close ×</button></form><img alt=""><p data-viewer-caption></p></dialog>' : ''}`;
}

export function about(site) {
  return `<section class="page-intro about-hero"><div><p class="eyebrow">Player profile</p><h1>About me<span class="cursor" aria-hidden="true">_</span></h1><p class="lede">I'm ${escape(site.name)}, a ${escape(site.degree)} student at the ${escape(site.school)}.</p><p>I like building small games around a distinct gameplay rule and refining it through play. I'm aiming for a career in game development while continuing to make personal and indie projects.</p><div class="actions"><a class="button primary" href="../projects/index.html">View projects <span aria-hidden="true">→</span></a>${site.resume ? `<a class="button" href="${url(site.resume, '../')}">Resume ${arrow}</a>` : ''}</div></div>${portrait(site, '../')}</section>
  <section class="detail-section"><div class="rail"><h2>Tools &amp; learning</h2></div><div class="contribution-grid">
    <article class="contribution"><p class="eyebrow">Primary language</p><h3>C++</h3><p>My main language for computer science and programming.</p></article>
    <article class="contribution"><p class="eyebrow">Current projects</p><h3>Unity &amp; C#</h3><p>Learning gameplay scripting, collision, and level design through my Unity projects.</p></article>
    <article class="contribution"><p class="eyebrow">Learning roadmap</p><h3>Unreal Engine</h3><p>Interested in learning how Unreal supports game development with C++.</p></article>
  </div></section>`;
}

export function contact(site) {
  const cards = [];
  if (site.email) cards.push(`<a class="contact-card" href="mailto:${escape(site.email)}"><span class="eyebrow">01 / Email</span><strong>${escape(site.email)}</strong><span aria-hidden="true">↗</span></a>`);
  if (site.linkedin) cards.push(`<a class="contact-card" href="${escape(site.linkedin)}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">02 / LinkedIn</span><strong>Connect on LinkedIn</strong><span aria-hidden="true">↗</span></a>`);
  if (site.github) cards.push(`<a class="contact-card" href="${escape(site.github)}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">03 / GitHub</span><strong>Explore my repositories</strong><span aria-hidden="true">↗</span></a>`);
  return `<section class="page-intro"><p class="eyebrow">Contact</p><h1>Let's connect<span class="cursor" aria-hidden="true">_</span></h1><p class="lede">Reach out about game development, internships, or the projects on this site.</p></section><div class="contact-grid">${cards.join('')}</div>`;
}
