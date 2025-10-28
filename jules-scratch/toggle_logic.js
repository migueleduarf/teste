/**
 * Alterna a exibição do carrinho de compras (sidebar)
 * @param {boolean} forceState - Se fornecido, força o estado (true = abrir, false = fechar)
 */
function toggleCart(forceState) {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (!sidebar || !overlay) return;

  const isOpen = !sidebar.classList.contains('translate-x-full');
  const shouldOpen = forceState === undefined ? !isOpen : forceState;

  if (shouldOpen) {
    // Se for para abrir o carrinho, garante que o painel de usuário esteja fechado
    toggleUserPanel(false);
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    // Só restaura o scroll se o outro painel também estiver fechado
    const userPanel = document.getElementById('user-panel');
    if (userPanel && userPanel.classList.contains('translate-x-full')) {
      document.body.style.overflow = '';
    }
  }
}

/**
 * Alterna a exibição do painel de usuário (sidebar)
 * @param {boolean} forceState - Se fornecido, força o estado (true = abrir, false = fechar)
 */
function toggleUserPanel(forceState) {
  const sidebar = document.getElementById('user-panel');
  const overlay = document.getElementById('user-panel-overlay');
  if (!sidebar || !overlay) return;

  const isOpen = !sidebar.classList.contains('translate-x-full');
  const shouldOpen = forceState === undefined ? !isOpen : forceState;

  if (shouldOpen) {
    // Se for para abrir o painel de usuário, garante que o carrinho esteja fechado
    toggleCart(false);
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateUserPanel();
  } else {
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    // Só restaura o scroll se o outro painel também estiver fechado
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar && cartSidebar.classList.contains('translate-x-full')) {
      document.body.style.overflow = '';
    }
  }
}
