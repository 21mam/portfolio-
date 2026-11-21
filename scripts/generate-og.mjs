import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const site = JSON.parse(await readFile(path.join(root, 'src/data/site.json'), 'utf8'));

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const name = escapeXml(site.name);
const role = escapeXml('Computer Science & Engineering student');
const company = escapeXml('Junior Software Engineer at iobytes');
const domain = escapeXml('mdabuzimam.dev');
const github = escapeXml('github.com/21mam');

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.7" fill="#3a3446" />
    </pattern>
    <radialGradient id="glow" cx="78%" cy="18%" r="70%">
      <stop offset="0%" stop-color="#6d4aff" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#6d4aff" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow2" cx="15%" cy="90%" r="55%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#0c0b11" />
  <rect width="1200" height="630" fill="url(#dots)" opacity="0.9" />
  <rect width="1200" height="630" fill="url(#glow)" />
  <rect width="1200" height="630" fill="url(#glow2)" />

  <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
    <text x="84" y="96" fill="#a78bfa" font-size="19" letter-spacing="5">PORTFOLIO · 2026</text>
    <text x="84" y="566" fill="#777184" font-size="22" letter-spacing="1">${domain}</text>
    <text x="1116" y="566" text-anchor="end" fill="#777184" font-size="22" letter-spacing="1">${github}</text>
  </g>

  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
    <text x="80" y="268" fill="#eceaf3" font-size="92" font-weight="700" letter-spacing="-4">${name}</text>
    <text x="84" y="336" fill="#a19bad" font-size="33">${role}</text>
    <text x="84" y="386" fill="#a19bad" font-size="33">${company}</text>
  </g>

  <rect x="84" y="436" width="88" height="6" rx="3" fill="#a78bfa" />

  <g fill="#a78bfa" opacity="0.9">
    <circle cx="1000" cy="150" r="4" />
    <circle cx="1052" cy="150" r="4" opacity="0.55" />
    <circle cx="1104" cy="150" r="4" opacity="0.25" />
    <circle cx="1000" cy="202" r="4" opacity="0.55" />
    <circle cx="1052" cy="202" r="4" opacity="0.25" />
    <circle cx="1104" cy="202" r="4" opacity="0.12" />
  </g>
</svg>`;

await mkdir(path.join(root, 'public'), { recursive: true });

await sharp(Buffer.from(ogSvg)).png().toFile(path.join(root, 'public', 'og.png'));

// Website and home-screen icons use the brand image with rounded corners.
const brandPath = path.join(root, 'public', 'brand.png');

const roundedIcon = async (size) => {
  const radius = Math.round(size * 0.28);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );

  return sharp(brandPath)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
};

await sharp(await roundedIcon(64)).toFile(path.join(root, 'public', 'favicon.png'));
await sharp(await roundedIcon(180)).toFile(path.join(root, 'public', 'apple-touch-icon.png'));

console.log('Generated public/og.png, favicon.png, and apple-touch-icon.png');