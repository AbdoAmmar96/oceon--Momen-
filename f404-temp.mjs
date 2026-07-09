import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
const bad = new Set();
p.on('response', r => { if (r.status() === 404) bad.add(r.url()); });
for (const u of ['/jobs?lang=en', '/jobs/field-service-engineer?lang=en']) {
  await p.goto('http://127.0.0.1:8010' + u, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
}
console.log([...bad].join('\n') || 'no 404s');
await b.close();
