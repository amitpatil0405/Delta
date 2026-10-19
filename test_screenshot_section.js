import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const section = await page.$('#deltafox-options');
  if (section) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await section.screenshot({ path: '/tmp/deltafox_options_section_desktop.png' });
    console.log('Saved section screenshot');
  }

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const sectionMobile = await page.$('#deltafox-options');
  if (sectionMobile) {
    await sectionMobile.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await sectionMobile.screenshot({ path: '/tmp/deltafox_options_section_mobile.png' });
    console.log('Saved mobile section screenshot');
  }

  await browser.close();
})();
