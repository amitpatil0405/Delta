import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(3000)

        # Scroll to chart section
        await page.evaluate("window.scrollTo(0, 1200)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path='/home/jules/verification/screenshots/chart_rendered.png')

        # Scroll to watchlist section
        await page.evaluate("window.scrollTo(0, 1900)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path='/home/jules/verification/screenshots/watchlist_rendered.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify())
