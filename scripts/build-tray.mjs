/**
 * build-tray.mjs
 * Gera dist/landing-tray.html: um ÚNICO arquivo (HTML + CSS + JS embutidos), pronto para colar
 * no editor de landing pages da Tray.
 *
 * - Embute assets/css/styles.css e assets/js/*.js no HTML.
 * - Converte todo caractere fora do ASCII em código seguro (entidades HTML, \uXXXX no JS,
 *   \HHHHHH no CSS). O editor da Tray não lê UTF-8 e trocava acentos/travessões por "?".
 *
 * Uso: node scripts/build-tray.mjs   (Node 16+, sem dependências)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const hex = (c, w) => c.codePointAt(0).toString(16).toUpperCase().padStart(w, '0');
const escJs = (t) => [...t].map((c) => {
  const cp = c.codePointAt(0);
  if (cp < 128) return c;
  if (cp < 0x10000) return '\\u' + hex(c, 4).toLowerCase();
  const s = c.split('').map((u) => '\\u' + u.charCodeAt(0).toString(16).padStart(4, '0'));
  return s.join('');
}).join('');
const escCss = (t) => [...t].map((c) => (c.codePointAt(0) < 128 ? c : '\\' + hex(c, 6))).join('');
const escHtml = (t) => [...t].map((c) => (c.codePointAt(0) < 128 ? c : '&#' + c.codePointAt(0) + ';')).join('');

let html = read('index.html');
const css = read('assets/css/styles.css');
const js = read('assets/js/config.js') + '\n' + read('assets/js/main.js');

html = html
  .replace(/\s*<link rel="stylesheet" href="assets\/css\/styles\.css">/, '')
  .replace(/\s*<script src="assets\/js\/config\.js" defer><\/script>/, '')
  .replace(/\s*<script src="assets\/js\/main\.js" defer><\/script>/, '');

// marcadores para não escapar o CSS/JS como HTML
const STYLE = '%%EFP_STYLE%%', SCRIPT = '%%EFP_SCRIPT%%';
html = html.replace('</head>', `<style>${STYLE}</style>\n</head>`)
           .replace('</body>', `<script>${SCRIPT}</script>\n</body>`);

let out = escHtml(html)
  .replace(STYLE, () => escCss(css))
  .replace(SCRIPT, () => escJs(js));

const nonAscii = [...out].filter((c) => c.codePointAt(0) > 127).length;
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/landing-tray.html'), out, 'ascii');
console.log(`dist/landing-tray.html gerado (${(out.length / 1024).toFixed(1)} KB, caracteres fora do ASCII: ${nonAscii})`);
