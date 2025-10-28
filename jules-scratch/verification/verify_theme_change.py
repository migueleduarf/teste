
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Obtenha o caminho absoluto para o arquivo index.html
        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # Tira um screenshot do tema claro (padrão)
        page.screenshot(path='jules-scratch/verification/verification_light.png')

        # Clica no botão para mudar de tema
        page.click('button[onclick="toggleTheme()"]')

        # Espera a notificação aparecer
        page.wait_for_selector('.toast.show')

        # Espera um pouco para a animação
        page.wait_for_timeout(500)

        # Tira um screenshot do tema escuro com a notificação
        page.screenshot(path='jules-scratch/verification/verification_dark_with_toast.png')

        browser.close()

if __name__ == '__main__':
    run()
