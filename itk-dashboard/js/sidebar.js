export function initSidebar() {
    const sidebar = document.querySelector('aside');
    const toggleBtn = document.getElementById('mobile-menu-btn');

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black/50 z-40 hidden md:hidden glass';
    backdrop.id = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            backdrop.classList.toggle('hidden');
        });

        backdrop.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            backdrop.classList.add('hidden');
        });
    }
}
