import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: '/home/jules/verification/videos' }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);

  // Scroll to Portfolio section to trigger whileInView number count-up animations
  await page.evaluate(() => {
    document.querySelector('#portfolio').scrollIntoView({ behavior: 'smooth' });
  });

  // Pause to verify that boxes are directly visible without entrance animation while numbers count up
  await page.waitForTimeout(2500);

  // Take screenshot of the static card containers with active count-up numbers
  await page.screenshot({ path: '/home/jules/verification/screenshots/portfolio_static_boxes.png' });
  await page.waitForTimeout(1000);

  await context.close();
  await browser.close();
  console.log('Static boxes verification completed successfully');
})();
