from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:5173", wait_until="networkidle")

    # Scroll to portfolio section
    portfolio_elem = page.locator("#portfolio")
    if portfolio_elem.count() > 0:
        portfolio_elem.scroll_into_view_if_needed()
        page.wait_for_timeout(2000)

    page.screenshot(path="/home/jules/verification/screenshots/pnl_curve_chart.png", full_page=False)
    browser.close()
