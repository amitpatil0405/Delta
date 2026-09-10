import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})
        page = await context.new_page()

        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(2000)

        # Scroll down to portfolio section
        portfolio = page.locator('#portfolio')
        if await portfolio.count() > 0:
            await portfolio.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)

            # Hover over first stat box to trigger neon orange highlight
            stat_box = page.locator('#portfolio .grid > div').first
            if await stat_box.count() > 0:
                await stat_box.hover()
                await page.wait_for_timeout(500)

            await page.screenshot(path='/home/jules/verification/screenshots/portfolio_neon_glow.png')
            print("Screenshot saved to /home/jules/verification/screenshots/portfolio_neon_glow.png")
        else:
            print("Portfolio section not found")

        await browser.close()

asyncio.run(run())
