from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Tira screenshot do estado inicial
        page.screenshot(path="jules-scratch/01_initial_state.png")

        # Abre o painel do carrinho
        page.locator("#cart-button").click()
        time.sleep(1) # Espera a animação
        page.screenshot(path="jules-scratch/02_cart_panel_open.png")

        # Fecha o painel do carrinho
        page.locator("#cart-close-button").click()
        time.sleep(1)

        # Abre o painel do usuário
        page.locator("#user-panel-button").click()
        time.sleep(1)
        page.screenshot(path="jules-scratch/03_user_panel_open.png")

        browser.close()

run()
