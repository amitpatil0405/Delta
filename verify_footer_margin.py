import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto("http://localhost:4180", wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)

        # Scroll to Footer
        footer = page.locator("footer")
        if await footer.count() > 0:
            await footer.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            await page.screenshot(path="verify_footer_margin.png")
            print("Captured verify_footer_margin.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
