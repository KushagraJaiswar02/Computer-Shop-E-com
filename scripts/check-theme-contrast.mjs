import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const palettes = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
  .filter(([, , body]) => body.includes('--color-background:'))
  .map(([, selector, body]) => ({ name: selector.trim().split('\n').at(-1), colors: Object.fromEntries([...body.matchAll(/--color-([\w-]+):\s*([\d ]+);/g)].map(([, name, value]) => [name, value.trim().split(/\s+/).map(Number)])) }));
function luminance(color) { return color.map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0); }
function contrast(a, b) { const [low, high] = [luminance(a), luminance(b)].sort((a, b) => a - b); return (high + .05) / (low + .05); }
for (const palette of palettes) {
  const baseName = palette.name.includes('admin-app') ? '.admin-app' : ':root';
  const base = palettes.find(item => item.name === baseName);
  palette.colors = { ...base?.colors, ...palette.colors };
}
let checks = 0;
for (const { name, colors } of palettes) {
  const check = (foreground, background, minimum = 4.5, label = '') => { const ratio = contrast(colors[foreground], Array.isArray(background) ? background : colors[background]); checks++; assert(ratio >= minimum, `${name}: ${foreground} / ${label || background}: ${ratio.toFixed(3)} < ${minimum}`); };
  for (const foreground of ['text', 'text-muted', 'accent-text']) for (const background of ['background', 'surface', 'surface-elevated', 'surface-soft']) check(foreground, background);
  for (const background of ['primary', 'primary-hover']) check('on-primary', background);
  for (const semantic of ['success', 'warning', 'danger', 'info']) check(`${semantic}-text`, colors[semantic].map((value, index) => value * .1 + colors.surface[index] * .9), 4.5, `${semantic} tint`);
  for (const background of ['surface', 'surface-elevated']) check('control-border', background, 3);
  check('focus-ring', 'background', 3);
  if (!name.includes('admin-app')) for (const coverage of [.4, .22]) check('inverse-text', colors['category-accent'].map((value, index) => value * coverage + colors.inverse[index] * (1 - coverage)), 4.5, `category gradient ${coverage}`);
  if (colors.sidebar) { check('sidebar-text', 'sidebar'); check('sidebar-on-active', 'sidebar-active'); }
}
console.log(`${checks} contrast checks passed across ${palettes.length} palettes (WCAG AA text and UI boundaries).`);
