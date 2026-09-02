import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto("http://localhost:5173/#training", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="/home/jules/verification/screenshots/verification_training_updated.png", full_page=False)

        await page.goto("http://localhost:5173/#contact", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="/home/jules/verification/screenshots/verification_contact_updated.png", full_page=False)

        await browser.close()

asyncio.run(main())
