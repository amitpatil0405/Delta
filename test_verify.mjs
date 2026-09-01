import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  await page.screenshot({ path: 'verify_hero.png' });

  const aboutSec = await page.$('#about');
  if (aboutSec) {
    await aboutSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verify_about.png' });
  }

  await browser.close();
  console.log("Screenshots captured successfully");
})();
