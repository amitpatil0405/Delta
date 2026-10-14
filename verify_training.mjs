import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const trainingEl = await page.$('#training');
  if (trainingEl) {
    await trainingEl.scrollIntoView();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: 'verification_training.png', fullPage: false });
  await browser.close();
  console.log('Screenshot saved to verification_training.png');
})();
