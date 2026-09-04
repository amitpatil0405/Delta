import os
from playwright.sync_api import sync_playwright

def run_verification():
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()

        page.goto("http://localhost:5178")
        page.wait_for_timeout(1000)

        # Scroll to Market section
        market_sec = page.locator("#market-section")
        market_sec.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        page.screenshot(path="/home/jules/verification/screenshots/market_prices.png")

        # Scroll to Sector Watchlist section
        watchlist_sec = page.locator("#watchlist-section")
        watchlist_sec.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        page.screenshot(path="/home/jules/verification/screenshots/watchlist_prices.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    run_verification()
