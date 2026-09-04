import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Scroll to portfolio section
  const portfolioSec = await page.$('#portfolio');
  if (portfolioSec) {
    await portfolioSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }

  // Click Central Admin Login
  await page.click('text="CENTRAL ADMIN LOGIN"');
  await page.waitForTimeout(500);

  // Enter password
  await page.fill('input[type="password"]', 'Pass123#$');
  await page.click('button:has-text("LOGIN AS ADMIN")');
  await page.waitForTimeout(500);

  // Click EDIT button on first trade
  const editBtn = await page.$('button:has-text("EDIT")');
  if (editBtn) {
    await editBtn.click();
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: '/home/jules/verification/screenshots/admin_edit_trade_modal.png' });

  await browser.close();
  console.log("Edit modal screenshot captured successfully");
})();
