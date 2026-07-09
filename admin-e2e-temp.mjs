import { chromium } from 'playwright';
const base = 'http://127.0.0.1:8010';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
const errs = [];
p.on('pageerror', e => errs.push(`PAGEERROR: ${e.message}`));

await p.goto(`${base}/admin/login`, { waitUntil: 'networkidle' });
await p.fill('input[type=email]', 'admin@oceandrilling.co.uk');
await p.fill('input[type=password]', 'OceanAdmin@2026');
await p.click('button[type=submit]');
await p.waitForURL('**/admin**', { timeout: 20000 });
await p.waitForTimeout(1500);
console.log('logged into admin:', new URL(p.url()).pathname);

for (const [name, path] of [['Job openings','/admin/job-openings'], ['Job applications','/admin/job-applications'], ['Member listings','/admin/listings'], ['Members','/admin/users']]) {
  const r = await p.goto(base + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const rows = await p.locator('table tbody tr').count();
  console.log(`${name.padEnd(18)} status=${r.status()} rows=${rows}`);
}

// the CV download action must be present on the application row
await p.goto(`${base}/admin/job-applications`, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
const cvBtn = await p.locator('table tbody tr').first().locator('text=CV').count();
console.log(`CV download action visible: ${cvBtn ? 'YES' : 'NO'}`);
await p.screenshot({ path: '/tmp/s-admin-apps.png' });
console.log(`\nJS errors: ${errs.length ? errs.join('\n') : 'none'}`);
await b.close();
