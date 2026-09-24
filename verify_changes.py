import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto("http://localhost:4175", wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)

        # Scroll to About section
        about_section = page.locator("#about")
        if await about_section.count() > 0:
            await about_section.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            await page.screenshot(path="verify_about.png")
            print("Captured verify_about.png")

        # Scroll to Footer
        footer = page.locator("footer")
        if await footer.count() > 0:
            await footer.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            await page.screenshot(path="verify_footer.png")
            print("Captured verify_footer.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
