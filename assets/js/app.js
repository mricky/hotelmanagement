// Antigravity Hotel PMS Application Script

// ==========================================================================
// GLOBAL DARK MODE & LIGHT MODE THEME ENGINE WITH FLOATING SWITCHER
// ==========================================================================
window.initAppTheme = function() {
  const savedTheme = localStorage.getItem('app_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeToggleUI();
};

window.toggleAppTheme = function() {
  const isDark = document.documentElement.classList.toggle('dark');
  const theme = isDark ? 'dark' : 'light';
  localStorage.setItem('app_theme', theme);
  updateThemeToggleUI();
  
  if (window.showToast) {
    window.showToast(`Mode Tampilan Diubah: ${isDark ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}`, 'info');
  }
};

function updateThemeToggleUI() {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = isDark ? `
      <span class="flex items-center gap-1.5 font-black text-xs">
        <i data-lucide="sun" class="w-4 h-4 text-amber-300"></i>
        <span>☀️ Mode Terang (Light)</span>
      </span>
    ` : `
      <span class="flex items-center gap-1.5 font-black text-xs">
        <i data-lucide="moon" class="w-4 h-4 text-blue-400"></i>
        <span>🌙 Mode Gelap (Dark)</span>
      </span>
    `;
  });
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function injectFloatingThemeSwitcher() {
  if (document.getElementById('floatingThemeSwitcherBtn')) return;
  
  const floatBtn = document.createElement('button');
  floatBtn.id = 'floatingThemeSwitcherBtn';
  floatBtn.type = 'button';
  floatBtn.onclick = window.toggleAppTheme;
  floatBtn.className = 'theme-toggle-btn fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-2xl font-black text-xs transition transform hover:scale-105 flex items-center gap-2 border border-slate-700/50 cursor-pointer';
  document.body.appendChild(floatBtn);
  updateThemeToggleUI();
}

// Immediate theme initialization to avoid flickering
initAppTheme();

// ==========================================================================
// MODAL MANAGEMENT & TOAST ENGINE
// ==========================================================================
window.openNewBookingModal = function() {
  const modal = document.getElementById('newBookingModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  } else {
    window.location.href = '/bookings?openModal=1';
  }
};

window.closeNewBookingModal = function() {
  const modal = document.getElementById('newBookingModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
};

window.openNewRoomModal = function() {
  const modal = document.getElementById('newRoomModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  } else {
    window.location.href = '/admin/rooms?openModal=1';
  }
};

window.closeNewRoomModal = function() {
  const modal = document.getElementById('newRoomModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
};

window.openNewGuestModal = function() {
  const modal = document.getElementById('newGuestModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  } else {
    window.location.href = '/guests?openModal=1';
  }
};

window.closeNewGuestModal = function() {
  const modal = document.getElementById('newGuestModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
};

window.showModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
};

window.showToast = function(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-5 right-5 px-5 py-3 rounded-2xl text-white font-bold text-xs shadow-2xl z-50 transition transform translate-y-2 opacity-0 ${
    type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-900'
  }`;
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 50);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Lucide Icons Auto-Init, Floating Switcher & Query Parameter Auto-Open
document.addEventListener('DOMContentLoaded', () => {
  injectFloatingThemeSwitcher();
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  updateThemeToggleUI();

  if (window.location.search.includes('openModal=1')) {
    setTimeout(() => {
      if (window.location.pathname.includes('rooms')) {
        window.openNewRoomModal();
      } else if (window.location.pathname.includes('guests')) {
        window.openNewGuestModal();
      } else {
        window.openNewBookingModal();
      }
    }, 250);
  }
});
