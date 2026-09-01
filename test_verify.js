const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Screenshot 1: Hero & Header with direct logo
  await page.screenshot({ path: 'verify_hero.png' });

  // Scroll to About section and verify photo/caption
  const aboutSec = await page.$('#about');
  if (aboutSec) {
    await aboutSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verify_about.png' });
  }

  // Scroll to Watchlist and click Add Symbol button to inspect password field
  const watchlistSec = await page.$('#markets');
  if (watchlistSec) {
    await watchlistSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verify_watchlist.png' });
  }

  await browser.close();
  console.log("Screenshots captured successfully");
})();
