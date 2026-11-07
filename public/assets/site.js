const filters = document.querySelector('.filter-bar');
if (filters) {
  const buttons = [...filters.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const empty = document.querySelector('.empty-state');
  const count = filters.querySelector('[data-count]');

  function select(category) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    for (const card of cards) card.hidden = category !== 'all' && category !== card.dataset.category;
    const visible = cards.filter((card) => !card.hidden).length;
    empty.hidden = visible > 0;
    count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
  }

  for (const button of buttons) button.addEventListener('click', () => select(button.dataset.filter));
  empty.querySelector('[data-reset-filter]').addEventListener('click', () => {
    select('all');
    buttons[0].focus();
  });
  filters.hidden = false;
  select('all');
}

const launch = document.querySelector('[data-launch]');
if (launch) {
  const player = document.querySelector('#game-frame');
  const slot = player.querySelector('[data-frame-slot]');
  const stop = player.querySelector('[data-stop]');
  launch.hidden = false;

  launch.addEventListener('click', () => {
    if (player.hidden) {
      const frame = document.createElement('iframe');
      frame.src = launch.dataset.launch;
      frame.title = `${launch.dataset.game} Unity Web player`;
      frame.allow = 'fullscreen';
      frame.allowFullscreen = true;
      slot.append(frame);
      player.hidden = false;
      launch.setAttribute('aria-expanded', 'true');
      launch.firstChild.textContent = 'Go to game ';
    }
    player.scrollIntoView({ block: 'center' });
    slot.firstElementChild.focus();
  });

  stop.addEventListener('click', () => {
    slot.replaceChildren();
    player.hidden = true;
    launch.setAttribute('aria-expanded', 'false');
    launch.firstChild.textContent = 'Play in browser ';
    launch.focus();
  });
}

const viewer = document.querySelector('#screenshot-viewer');
if (viewer?.showModal) {
  const fullImage = viewer.querySelector('img');
  const caption = viewer.querySelector('[data-viewer-caption]');
  let lastLink;

  for (const link of document.querySelectorAll('[data-gallery]')) {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      lastLink = link;
      fullImage.src = link.href;
      fullImage.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption;
      viewer.showModal();
    });
  }
  viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => lastLink?.focus());
}
