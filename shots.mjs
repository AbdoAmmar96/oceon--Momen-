import { chromium } from 'playwright';

const base = 'http://127.0.0.1:8090';
const shots = [
  ['home-en', `${base}/?lang=en`],
  ['home-ar', `${base}/?lang=ar`],
  ['home-fr', `${base}/?lang=fr`],
  ['products-ar', `${base}/products?lang=ar`],
  ['services-ar', `${base}/services?lang=ar`],
  ['contact-ar', `${base}/contact?lang=ar`],
  ['about-en', `${base}/about?lang=en`],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const [name, url] of shots) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600); // preloader + hero reveal
  // force-reveal everything below the fold so the full-page shot shows real layout
  await page.evaluate(() => {
    document.querySelectorAll('[data-rv],[data-rvs],.steps').forEach(el => el.classList.add('in'));
    document.querySelector('.hero')?.classList.add('ready');
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `/tmp/shot-${name}.png`, fullPage: true });
  console.log('shot:', name);
}
await browser.close();
