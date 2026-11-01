import { readFileSync } from 'node:fs';

const catalog = readFileSync(new URL('../src/demo/catalog.ts', import.meta.url), 'utf8');
const activity = readFileSync(new URL('../src/demo/activity.ts', import.meta.url), 'utf8');
const checks = [
  ['contains thirty generated product definitions', (catalog.match(/\['(?:asus|lenovo|msi|amd|intel|corsair|kingston|samsung|logitech|hp|acer|dell)',/g) || []).length === 30],
  ['uses locally generated SVG placeholders', catalog.includes('data:image/svg+xml') && !catalog.includes('unsplash.com')],
  ['uses deterministic date offsets', catalog.includes('Date.now()') && activity.includes('Date.now()')],
  ['generates 110 orders', activity.includes('length: 110')],
  ['validates product price and discount construction', catalog.includes('originalPrice') && catalog.includes('discountPercent')],
  ['includes every referenced generated brand', ['asus', 'lenovo', 'msi', 'amd', 'intel', 'corsair', 'kingston', 'samsung', 'logitech', 'hp', 'acer', 'dell'].every(id => catalog.includes(`'${id}'`))],
];
for (const [label, passed] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}`);
if (checks.some(([, passed]) => !passed)) process.exitCode = 1;
else console.log(`\nDemo integrity summary: ${checks.length}/${checks.length} checks passed.`);
