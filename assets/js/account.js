'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initAccountNavigation();
  initAccountTriggers();
  initTopupModal();
  initTopupDropdown();
  initTopupForm();
  initSettingsForms();
});

/**
 * Инициализация форм в разделе настроек
 */
function initSettingsForms() {
  const emailForm = document.getElementById('emailChangeForm');
  const passwordForm = document.getElementById('passwordChangeForm');
  const securityModal = document.getElementById('securityCodeModal');
  const securityForm = document.getElementById('securityCodeForm');

  // Смена почты
  emailForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    securityModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  // Подтверждение кодом
  securityForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    securityModal.classList.remove('is-open');
    document.body.style.overflow = '';
    showNotification('Электронная почта успешно изменена!');
  });

  // Смена пароля
  passwordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Пароль успешно обновлен!');
    passwordForm.reset();
  });

  // Закрытие модалки кода
  securityModal?.querySelector('.topup-modal__close')?.addEventListener('click', () => {
    securityModal.classList.remove('is-open');
    document.body.style.overflow = '';
  });
}

/**
 * Показ уведомления (Toast)
 */
function showNotification(message, type = 'success') {
  const container = document.getElementById('notificationContainer');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification__close">&times;</button>
  `;

  container.appendChild(notification);

  // Показ
  setTimeout(() => notification.classList.add('is-visible'), 100);

  // Авто-скрытие через 4 секунды
  const timer = setTimeout(() => {
    hideNotification(notification);
  }, 4000);

  // Закрытие по кнопке
  notification.querySelector('.notification__close').addEventListener('click', () => {
    clearTimeout(timer);
    hideNotification(notification);
  });
}

function hideNotification(el) {
  el.classList.remove('is-visible');
  setTimeout(() => el.remove(), 400);
}

/**
 * Модальное окно пополнения счета
 */
function initTopupModal() {
  const modal = document.getElementById('topupModal');
  const openBtns = document.querySelectorAll('.account-card__btn-action'); // Кнопка "Пополнить счет"
  const closeBtn = modal?.querySelector('.topup-modal__close');
  const overlay = modal?.querySelector('.topup-modal__overlay');

  if (!modal || !openBtns.length) return;

  const openModal = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => {
    if (btn.textContent.includes('ПОПОЛНИТЬ')) {
      btn.addEventListener('click', openModal);
    }
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);
}

/**
 * Кастомный выпадающий список для выбора оплаты
 */
function initTopupDropdown() {
  const dropdown = document.getElementById('paymentDropdown');
  if (!dropdown) return;

  const selected = dropdown.querySelector('.topup-dropdown__selected');
  const items = dropdown.querySelectorAll('.topup-dropdown__item');

  selected.addEventListener('click', () => {
    dropdown.classList.toggle('is-active');
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      selected.querySelector('span').textContent = item.textContent;
      dropdown.classList.remove('is-active');
    });
  });

  // Закрытие при клике вне
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('is-active');
    }
  });
}

/**
 * Валидация и отправка формы пополнения
 */
function initTopupForm() {
  const form = document.getElementById('topupForm');
  const input = document.getElementById('topupAmount');
  const totalValue = document.getElementById('topupTotal');
  const submitBtn = document.getElementById('btnConfirmTopup');

  if (!form || !input) return;

  const validate = () => {
    const val = parseFloat(input.value);
    
    // Обновляем "К получению"
    if (isNaN(val) || val <= 0) {
      totalValue.textContent = '0 ₽';
      submitBtn.disabled = true;
    } else {
      totalValue.textContent = val + ' ₽';
      // Кнопка активна только в диапазоне 50 - 100 000
      submitBtn.disabled = val < 50 || val > 100000;
    }
  };

  input.addEventListener('input', validate);
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = input.value;
    // Имитация перехода на страницу оплаты и затем на успех
    window.location.href = `payment-success.html?amount=${amount}`;
  });

  // Первичная валидация
  validate();
}

/**
 * Логика навигации в боковой панели
 */
function initAccountNavigation() {
  const navLinks = document.querySelectorAll('.account-nav__link');
  const overview = document.getElementById('overviewSection');
  const settings = document.getElementById('settingsSection');
  const pageTitle = document.getElementById('accountPageTitle');

  if (!navLinks.length) return;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Если ссылка должна открыться в новом окне, не блокируем переход
      if (link.getAttribute('target') === '_blank') return;

      e.preventDefault();
      
      // Переключение активного состояния в меню
      navLinks.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');

      const sectionName = link.querySelector('span').textContent;
      
      if (sectionName === 'Обзор') {
        overview.style.display = 'block';
        settings.style.display = 'none';
        pageTitle.textContent = 'Добро пожаловать в Зону, Skif_77';
      } else if (sectionName === 'Настройки') {
        overview.style.display = 'none';
        settings.style.display = 'block';
        pageTitle.textContent = 'Настройки аккаунта';
      }
    });
  });
}

/**
 * Специфичные для аккаунта триггеры
 */
function initAccountTriggers() {
  // Кнопка выхода
  const logoutBtn = document.querySelector('.account-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = 'index.html';
      }
    });
  }

  // Взаимодействие с кнопкой баннера (если нужно что-то помимо открытия модалки)
  const bannerBtn = document.getElementById('btnOpenEditionsBanner');
  if (bannerBtn) {
    bannerBtn.addEventListener('click', () => {
      console.log('Пользователь нажал кнопку в баннере личного кабинета');
    });
  }
}
