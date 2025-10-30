import pytest
from playwright.sync_api import Page, expect
import re

# Constantes para seletores
CART_BUTTON = '#cart-button'
USER_PANEL_BUTTON = '#user-panel-button'
CART_SIDEBAR = '#cart-sidebar'
USER_PANEL = '#user-panel'
CART_OVERLAY = '#cart-overlay'
USER_PANEL_OVERLAY = '#user-panel-overlay'
CART_CLOSE_BUTTON = '#cart-close-button'
USER_PANEL_CLOSE_BUTTON = '#user-panel-close-button'

# URL base
BASE_URL = "http://localhost:8000"

def test_generic_sidebar_functionality_and_body_scroll(page: Page):
    """
    Testa a funcionalidade genérica dos painéis laterais (carrinho e usuário),
    incluindo a abertura, o fechamento, a exclusividade (apenas um aberto por vez)
    e o comportamento de bloqueio de rolagem do body.
    """
    page.goto(BASE_URL)

    # 1. Verifica o estado inicial: painéis e overlays estão ocultos
    expect(page.locator(CART_SIDEBAR)).to_have_class(re.compile(r'translate-x-full'))
    expect(page.locator(USER_PANEL)).to_have_class(re.compile(r'translate-x-full'))
    expect(page.locator(CART_OVERLAY)).to_be_hidden()
    expect(page.locator(USER_PANEL_OVERLAY)).to_be_hidden()

    # Verifica se o scroll do body está habilitado
    body_overflow = page.evaluate("document.body.style.overflow")
    assert body_overflow == ""

    # 2. Abre o painel do carrinho
    page.locator(CART_BUTTON).click()
    page.wait_for_timeout(500)  # Espera a animação

    # Verifica se o carrinho está visível e a sobreposição também
    expect(page.locator(CART_SIDEBAR)).not_to_have_class(re.compile(r'translate-x-full'))
    expect(page.locator(CART_OVERLAY)).to_be_visible()

    # Verifica se o scroll do body está bloqueado
    body_overflow = page.evaluate("document.body.style.overflow")
    assert body_overflow == "hidden"

    # 3. Fecha o painel do carrinho clicando no overlay para testar o próximo painel
    page.locator(CART_OVERLAY).click(position={'x': 10, 'y': 10})
    page.wait_for_timeout(500)
    expect(page.locator(CART_SIDEBAR)).to_have_class(re.compile(r'translate-x-full'))

    # Verifica se o scroll do body foi liberado
    body_overflow = page.evaluate("document.body.style.overflow")
    assert body_overflow == ""

    # 4. Abre o painel do usuário
    page.locator(USER_PANEL_BUTTON).click()
    page.wait_for_timeout(500) # Espera a animação

    # Verifica se o painel do usuário está visível e a sobreposição também
    expect(page.locator(USER_PANEL)).not_to_have_class(re.compile(r'translate-x-full'))
    expect(page.locator(USER_PANEL_OVERLAY)).to_be_visible()

    # Garante que o painel do carrinho permanece fechado
    expect(page.locator(CART_SIDEBAR)).to_have_class(re.compile(r'translate-x-full'))

    # Verifica se o scroll do body está bloqueado novamente
    body_overflow = page.evaluate("document.body.style.overflow")
    assert body_overflow == "hidden"

    # 5. Fecha o painel do usuário usando o botão de fechar
    page.locator(USER_PANEL_CLOSE_BUTTON).click()
    page.wait_for_timeout(500) # Espera a animação

    # Verifica se o painel do usuário e a sobreposição estão ocultos
    expect(page.locator(USER_PANEL)).to_have_class(re.compile(r'translate-x-full'))
    expect(page.locator(USER_PANEL_OVERLAY)).to_be_hidden()

    # Verifica se o scroll do body foi liberado
    body_overflow = page.evaluate("document.body.style.overflow")
    assert body_overflow == ""
