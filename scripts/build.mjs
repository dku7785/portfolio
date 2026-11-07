import { cp, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { page, home, projects, project, about, contact } from './templates.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = resolve(root, 'dist');
const publicDir = join(root, 'public');
const content = join(root, 'content');
const json = async (path) => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const site = await json(join(content, 'site.json'));
const projectDir = join(content, 'projects');
const entries = (await readdir(projectDir)).filter((name) => name.endsWith('.json'));
const games = (await Promise.all(entries.map((name) => json(join(projectDir, name)))))
  .sort((first, second) => String(first.number ?? '9999').localeCompare(String(second.number ?? '9999'), 'en', { numeric: true }));

// Check content before replacing the generated site. URLs in content are either HTTPS or public paths.
async function checkUrl(url) {
  if (!url || url.startsWith('https://')) return;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(url) || url.split('/').includes('..')) {
    throw new Error(`Use a public/ path or an HTTPS URL: ${url}`);
  }
  if (!(await lstat(join(publicDir, url))).isFile()) throw new Error(`Missing file: public/${url}`);
}

await Promise.all([site.photo, site.resume, site.linkedin, site.github].map(checkUrl));
const slugs = new Set();
for (const game of games) {
  if (typeof game.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug) || slugs.has(game.slug)) {
    throw new Error(`Project slug must be unique and use lower-case words: ${game.slug}`);
  }
  slugs.add(game.slug);
  if (!game.title?.trim() || !game.description?.trim() || typeof game.category !== 'string'
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.category) || game.category === 'all') {
    throw new Error(`Project ${game.slug} needs a title, description, and category other than all.`);
  }
  const images = [...(game.gallery ?? []), ...(game.stages ?? []).flatMap((stage) => stage.images ?? [])];
  await Promise.all([game.cover, game.play?.url, game.download?.url, game.source,
    game.reference, game.video?.src, game.video?.captions, ...images.map(({ src }) => src),
    ...(game.links ?? []).map(({ url }) => url)].map(checkUrl));
}

if (dist !== join(root, 'dist')) throw new Error('Invalid output path');
const oldDist = await lstat(dist).catch((error) => {
  if (error.code !== 'ENOENT') throw error;
  return null;
});
if (oldDist?.isSymbolicLink()) throw new Error('dist must be a regular directory');
if (oldDist) await rm(dist, { recursive: true });
await cp(publicDir, dist, { recursive: true });

// Use a portable build so ordinary static hosts can serve the game without custom headers.
// The supplied Unity export stays compressed in public/. Only the copies in dist/ are changed.
for (const game of games) {
  if (game.play?.mode !== 'embed' || !game.play.url.startsWith('games/')) continue;
  const index = join(dist, game.play.url);
  const buildDir = join(dirname(index), 'Build');
  let html = await readFile(index, 'utf8');
  for (const name of await readdir(buildDir)) {
    const compression = name.endsWith('.br') ? '.br' : name.endsWith('.gz') ? '.gz' : '';
    if (!compression || !html.includes(name)) continue;
    const source = join(buildDir, name);
    const outputName = name.slice(0, -compression.length);
    const unpack = compression === '.br' ? brotliDecompressSync : gunzipSync;
    await writeFile(join(buildDir, outputName), unpack(await readFile(source)));
    await rm(source);
    html = html.replaceAll(name, outputName);
  }
  // Fit Unity's default desktop template in the portfolio's player panel.
  html = html.replace('</head>', `<style>
    html, body { width: 100%; height: 100%; margin: 0; background: #100e14; }
    #unity-container.unity-desktop { width: 100%; height: 100%; left: 0; top: 0; transform: none; }
    #unity-container.unity-desktop #unity-canvas { display: block; width: 100% !important; height: calc(100% - 38px) !important; }
    #unity-build-title { color: #eae4f2; font: 13px/38px system-ui, sans-serif; }
    #unity-logo-title-footer { filter: invert(.88); }
  </style>\n</head>`);
  await writeFile(index, html);
}

async function save(path, html) {
  const target = join(dist, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, 'utf8');
}

await save('index.html', page(site, 'Home', './', home(site, games), site.intro));
await save('projects/index.html', page(site, 'Projects', '../', projects(games)));
await save('about/index.html', page(site, 'About', '../', about(site)));
await save('contact/index.html', page(site, 'Contact', '../', contact(site)));
for (const game of games) {
  await save(`projects/${game.slug}/index.html`, page(site, game.title, '../../', project(game), game.description, 'Projects'));
}
await writeFile(join(dist, '.nojekyll'), '');
console.log(`Built ${games.length + 4} portfolio pages in ${dist}`);
