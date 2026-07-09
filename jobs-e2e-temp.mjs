import { chromium } from 'playwright';

const base = 'http://127.0.0.1:8010';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errs = [];
page.on('pageerror', (e) => errs.push(`PAGEERROR: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errs.push(`CONSOLE: ${m.text()}`); });
const settle = () => page.waitForTimeout(1400);

// 1. Jobs list shows only open roles
await page.goto(`${base}/jobs?lang=en`, { waitUntil: 'networkidle' });
await settle();
console.log(`nav "Jobs" present: ${await page.locator('.main-nav a', { hasText: 'Jobs' }).count() ? 'YES' : 'NO'}`);
console.log(`open role listed: ${await page.locator('.job-card', { hasText: 'Field Service Engineer' }).count() ? 'YES' : 'NO'}`);
console.log(`closed role hidden: ${await page.locator('.job-card', { hasText: 'Closed Role' }).count() === 0 ? 'YES' : 'NO (BUG)'}`);

// 2. Closed role must 404
const r = await page.goto(`${base}/jobs/closed-role`);
console.log(`closed role direct URL status: ${r.status()}`);

// 3. Guest sees the login gate, not the form
await page.goto(`${base}/jobs/field-service-engineer?lang=en`, { waitUntil: 'networkidle' });
await settle();
console.log(`guest sees login gate: ${await page.locator('.job-gate').count() ? 'YES' : 'NO'}`);
console.log(`guest sees apply form: ${await page.locator('input[type=file]').count() ? 'YES (BUG)' : 'NO (correct)'}`);
await page.screenshot({ path: '/tmp/s-job-guest.png', fullPage: true });

// 4. Register, then apply with a real CV upload
const email = `cand${Date.now()}@example.com`;
await page.goto(`${base}/register?lang=en`, { waitUntil: 'networkidle' });
await settle();
await page.locator('.lf-row input[type=text]').first().fill('Job Candidate');
await page.locator('.lf-row input[type=email]').fill(email);
const pw = page.locator('.lf-row input[type=password]');
await pw.nth(0).fill('SuperSecret123!');
await pw.nth(1).fill('SuperSecret123!');
await page.locator('.lf button.btn').click();
await page.waitForURL('**/dashboard', { timeout: 15000 });

await page.goto(`${base}/jobs/field-service-engineer?lang=en`, { waitUntil: 'networkidle' });
await settle();
console.log(`member sees apply form: ${await page.locator('input[type=file]').count() ? 'YES' : 'NO'}`);
await page.locator('.lf-row input[type=text]').nth(1).fill('+357 99 123456'); // phone
await page.locator('input[type=file]').setInputFiles('/tmp/my-cv.pdf');
await page.locator('.lf button.btn').click();
await page.waitForURL('**/dashboard', { timeout: 20000 });
await settle();
const st = await page.locator('.dash-apps .st').first().innerText().catch(() => '(none)');
console.log(`application status on dashboard: "${st}"`);
console.log(`cv name shown: ${await page.locator('.dash-apps .dash-type').first().innerText().catch(() => '(none)')}`);
await page.screenshot({ path: '/tmp/s-dash-apps.png', fullPage: true });

// 5. Duplicate application must be refused
await page.goto(`${base}/jobs/field-service-engineer?lang=en`, { waitUntil: 'networkidle' });
await settle();
console.log(`re-apply blocked: ${await page.locator('.job-done').count() ? 'YES (correct)' : 'NO (BUG)'}`);

console.log(`\nJS errors: ${errs.length ? errs.join('\n') : 'none'}`);
await browser.close();
