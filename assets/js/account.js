'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initAccountNavigation();
  initAccountTriggers();
  initTopupModal();
  initTopupDropdown();
  initTopupForm();
  initSettingsForms();
  initGiftModal();
  initPurchaseInterception();
});

/**
 * Перехват клика по кнопке покупки в модалке изданий
 */
function initPurchaseInterception() {
  const buyBtn = document.getElementById('btnOpenAuthEditions');
  if (!buyBtn) return;

  buyBtn.addEventListener('click', (e) => {
    const editionsModal = document.getElementById('editionsModal');
    if (!editionsModal) return;

    // Проверяем, выбрано ли издание «Саркофаг»
    const activeTab = editionsModal.querySelector('.editions-modal__tab--active');
    if (activeTab && activeTab.dataset.target === 'ultimate') {
      e.preventDefault();
      e.stopImmediatePropagation(); // Чтобы не срабатывал стандартный тост ниже
      
      editionsModal.classList.remove('is-open');
      initGiftModalLogic(); // Сбрасываем и открываем модалку подарка
      return;
    }

    e.preventDefault();
    
    showNotification(
      'Недостаточно баланса на счету.', 
      'error',
      '<button class="notification__btn" id="btnTopupFromToast">Пополнить баланс</button>'
    );
  });

  // Делегирование события для кнопки в уведомлении
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btnTopupFromToast') {
      const topupModal = document.getElementById('topupModal');
      if (topupModal) {
        // Закрываем модалку изданий и подарка, если они открыты
        const editionsModal = document.getElementById('editionsModal');
        const giftModal = document.getElementById('giftModal');
        if (editionsModal) editionsModal.classList.remove('is-open');
        if (giftModal) giftModal.classList.remove('is-open');

        // Открываем модалку пополнения
        topupModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        
        // Удаляем уведомление
        const notification = e.target.closest('.notification');
        if (notification) hideNotification(notification);
      }
    }
  });
}

/**
 * Инициализация форм в разделе настроек
 */
function initSettingsForms() {
  const emailForm = document.getElementById('emailChangeForm');
  const passwordForm = document.getElementById('passwordChangeForm');
  const securityModal = document.getElementById('securityCodeModal');
  const securityForm = document.getElementById('securityCodeForm');

  const showInputError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input && errorEl) {
      input.classList.add('is-invalid');
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
  };

  const hideInputError = (inputId, errorId) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input && errorEl) {
      input.classList.remove('is-invalid');
      errorEl.classList.remove('is-visible');
    }
  };

  // Очистка ошибок при вводе
  const inputs = document.querySelectorAll('.settings-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const errorEl = input.nextElementSibling;
      if (errorEl && errorEl.classList.contains('error-message')) {
        input.classList.remove('is-invalid');
        errorEl.classList.remove('is-visible');
      }
    });
  });

  // Смена почты
  emailForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newEmail = document.getElementById('newEmail');
    let isValid = true;

    if (!newEmail.value.trim()) {
      showInputError('newEmail', 'newEmailError', 'Введите адрес почты');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value)) {
      showInputError('newEmail', 'newEmailError', 'Некорректный формат почты');
      isValid = false;
    }

    if (isValid) {
      securityModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Подтверждение кодом
  securityForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    securityModal.classList.remove('is-open');
    document.body.style.overflow = '';
    showNotification('Электронная почта успешно изменена!');
    emailForm.reset();
  });

  // Смена пароля
  passwordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPass = document.getElementById('currentPassword');
    const newPass = document.getElementById('newPassword');
    const confirmPass = document.getElementById('confirmPassword');
    let isValid = true;

    if (!currentPass.value) {
      showInputError('currentPassword', 'currentPasswordError', 'Введите текущий пароль');
      isValid = false;
    }

    if (newPass.value.length < 8) {
      showInputError('newPassword', 'newPasswordError', 'Минимум 8 символов');
      isValid = false;
    }

    if (newPass.value !== confirmPass.value) {
      showInputError('confirmPassword', 'confirmPasswordError', 'Пароли не совпадают');
      isValid = false;
    } else if (!confirmPass.value) {
      showInputError('confirmPassword', 'confirmPasswordError', 'Повторите пароль');
      isValid = false;
    }

    if (isValid) {
      showNotification('Пароль успешно обновлен!');
      passwordForm.reset();
    }
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
function showNotification(message, type = 'success', actionHtml = '') {
  const container = document.getElementById('notificationContainer');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__message">${message}</span>
      ${actionHtml ? `<div class="notification__action">${actionHtml}</div>` : ''}
    </div>
    <button class="notification__close" aria-label="Закрыть">&times;</button>
  `;

  container.appendChild(notification);

  // Показ
  setTimeout(() => notification.classList.add('is-visible'), 100);

  // Авто-скрытие через 6 секунд (для ошибок с кнопкой даем больше времени)
  const duration = type === 'error' ? 8000 : 4000;
  const timer = setTimeout(() => {
    hideNotification(notification);
  }, duration);

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
      
      // Скрываем все секции
      overview.style.display = 'none';
      settings.style.display = 'none';
      const sponsorship = document.getElementById('sponsorshipSection');
      if (sponsorship) sponsorship.style.display = 'none';
      
      if (sectionName === 'Обзор') {
        overview.style.display = 'block';
        pageTitle.textContent = 'Добро пожаловать в Зону, Skif_77';
      } else if (sectionName === 'Спонсорство') {
        if (sponsorship) sponsorship.style.display = 'block';
        pageTitle.textContent = 'Спонсорство проекта';
      } else if (sectionName === 'Настройки') {
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
  const logoutModal = document.getElementById('logoutModal');
  const confirmLogout = document.getElementById('confirmLogout');
  const cancelLogout = document.getElementById('cancelLogout');

  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    confirmLogout?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    const closeLogout = () => {
      logoutModal.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    cancelLogout?.addEventListener('click', closeLogout);
    logoutModal.querySelector('.topup-modal__close')?.addEventListener('click', closeLogout);
    logoutModal.querySelector('.topup-modal__overlay')?.addEventListener('click', closeLogout);
  }

  // Взаимодействие с кнопкой баннера (если нужно что-то помимо открытия модалки)
  const bannerBtn = document.getElementById('btnOpenEditionsBanner');
  if (bannerBtn) {
    bannerBtn.addEventListener('click', () => {
      console.log('Пользователь нажал кнопку в баннере личного кабинета');
    });
  }

  // Sponsorship Modals
  const easterEggModal = document.getElementById('easterEggModal');
  const sponsorshipSection = document.getElementById('sponsorshipSection');
  
  if (sponsorshipSection && easterEggModal) {
    const banners = sponsorshipSection.querySelectorAll('.account-banner');
    
    // Уникальный скин (первый баннер)
    const skinModal = document.getElementById('skinModal');
    const btnSkin = banners[0]?.querySelector('.account-banner__btn');
    if (btnSkin && skinModal) {
      btnSkin.addEventListener('click', (e) => {
        e.preventDefault();
        skinModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }

    // Пасхалка (второй баннер)
    const btnEasterEgg = banners[1]?.querySelector('.account-banner__btn');
    if (btnEasterEgg) {
      btnEasterEgg.addEventListener('click', (e) => {
        e.preventDefault();
        easterEggModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }

    // Именной NPC (третий баннер)
    const npcModal = document.getElementById('npcModal');
    const btnNPC = banners[2]?.querySelector('.account-banner__btn');
    if (btnNPC && npcModal) {
      btnNPC.addEventListener('click', (e) => {
        e.preventDefault();
        npcModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }

    // Закрытие модалок спонсорства
    const closeBtns = document.querySelectorAll('.topup-modal__close, .topup-modal__overlay');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.topup-modal');
        if (modal) {
          modal.classList.remove('is-open');
          if (!document.querySelector('.topup-modal.is-open')) {
            document.body.style.overflow = '';
          }
        }
      });
    });
  }
}

/**
 * Логика модального окна подарка (Саркофаг)
 */
function initGiftModal() {
  const modal = document.getElementById('giftModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.topup-modal__close');
  const overlay = modal.querySelector('.topup-modal__overlay');
  const options = modal.querySelectorAll('input[name="giftOption"]');
  const nickInput = document.getElementById('giftFriendNickname');
  const confirmBtn = document.getElementById('btnConfirmGiftPurchase');

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  options.forEach(opt => opt.addEventListener('change', updateGiftUI));
  nickInput?.addEventListener('input', updateGiftUI);

  confirmBtn?.addEventListener('click', () => {
    showNotification(
      'Недостаточно баланса на счету.', 
      'error',
      '<button class="notification__btn" id="btnTopupFromToast">Пополнить баланс</button>'
    );
  });
}

/**
 * Функция сброса и открытия модалки (вызывается из перехватчика)
 */
function initGiftModalLogic() {
  const modal = document.getElementById('giftModal');
  if (!modal) return;

  const options = modal.querySelectorAll('input[name="giftOption"]');
  const nickBlock = document.getElementById('giftNicknameBlock');
  const nickInput = document.getElementById('giftFriendNickname');
  const summary = document.getElementById('giftSummaryDetails');
  const confirmBtn = document.getElementById('btnConfirmGiftPurchase');

  // Сброс состояния
  options.forEach(opt => opt.checked = false);
  if (nickBlock) nickBlock.style.display = 'none';
  if (nickInput) nickInput.value = '';
  if (summary) summary.innerHTML = '<p class="gift-summary__placeholder">Выберите один из вариантов</p>';
  if (confirmBtn) confirmBtn.disabled = true;

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

/**
 * Обновление интерфейса модалки подарка при выборе опций
 */
function updateGiftUI() {
  const modal = document.getElementById('giftModal');
  const selected = modal?.querySelector('input[name="giftOption"]:checked')?.value;
  const nickBlock = document.getElementById('giftNicknameBlock');
  const nickInput = document.getElementById('giftFriendNickname');
  const summary = document.getElementById('giftSummaryDetails');
  const confirmBtn = document.getElementById('btnConfirmGiftPurchase');

  if (!selected || !summary || !confirmBtn) return;

  if (selected === 'no') {
    if (nickBlock) nickBlock.style.display = 'none';
    summary.innerHTML = `
      <div class="gift-summary__item"><span>Саркофаг</span><span>1090 ₽</span></div>
      <div class="gift-summary__total"><span>Итого</span><span>1090 ₽</span></div>
    `;
    confirmBtn.disabled = false;
  } else if (selected === 'yes') {
    if (nickBlock) nickBlock.style.display = 'block';
    summary.innerHTML = `
      <div class="gift-summary__item"><span>Саркофаг</span><span>1090 ₽</span></div>
      <div class="gift-summary__item"><span>Периметр для друга</span><span>210 ₽</span></div>
      <div class="gift-summary__total"><span>Итого</span><span>1300 ₽</span></div>
    `;
    confirmBtn.disabled = !nickInput?.value.trim();
  }
}

