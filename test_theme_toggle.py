import re
from playwright.sync_api import Page, expect

def test_theme_toggle_toast_notification(page: Page):
    # Navigate to the local index.html file
    page.goto("file:///app/index.html")

    # Click the theme toggle button
    theme_button = page.locator("button[onclick='toggleTheme()']")
    theme_button.click()

    # The toast should appear with the correct message
    toast = page.locator("#toast-container .toast")
    expect(toast).to_be_visible()
    expect(toast).to_have_text(re.compile("Tema alterado para"))
