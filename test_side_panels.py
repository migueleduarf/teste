import re
from playwright.sync_api import Page, expect
import os

def test_side_panels_open(page: Page):
    # Get the absolute path to the HTML file
    file_path = os.path.abspath('index.html')
    page.goto(f"file://{file_path}")

    # Define locators for panels and buttons
    user_panel = page.locator("#user-panel")
    cart_panel = page.locator("#cart-sidebar")
    user_button = page.locator("#user-panel-button")
    cart_button = page.locator("#cart-button")

    # 1. Verify both panels are initially hidden
    expect(user_panel).to_have_class(re.compile(r"translate-x-full"))
    expect(cart_panel).to_have_class(re.compile(r"translate-x-full"))

    # 2. Test User Panel opening
    user_button.click()
    page.wait_for_timeout(500) # Wait for animation
    expect(user_panel).not_to_have_class(re.compile(r"translate-x-full"))
    expect(page.locator("#user-panel h2:has-text('Meu Perfil')")).to_be_visible()

    # 3. Test Cart Panel opening (should close user panel)
    cart_button.click()
    page.wait_for_timeout(500) # Wait for animation
    expect(cart_panel).not_to_have_class(re.compile(r"translate-x-full"))
    expect(user_panel).to_have_class(re.compile(r"translate-x-full"))
    expect(page.locator("#cart-sidebar h2:has-text('Carrinho de Compras')")).to_be_visible()
