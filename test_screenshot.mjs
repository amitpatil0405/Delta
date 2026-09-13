import { chromium } from 'playwright';
import { spawn } from 'child_process';

const server = spawn('npx', ['vite'], { stdio: 'ignore', detached: true });
await new Promise(r => setTimeout(r, 2500));

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:5173/#portfolio', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const element = page.locator('#portfolio');
  await element.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/home/jules/verification/screenshots/pnl_curve_bg.png' });
  console.log('Screenshot saved to /home/jules/verification/screenshots/pnl_curve_bg.png');
  await browser.close();
} finally {
  try { process.kill(-server.pid); } catch(e){}
}
