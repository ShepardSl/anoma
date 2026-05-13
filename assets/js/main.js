

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initVideoModal();
  initAuthModal();
  initResetPasswordPage();
  initEditionsModal();
  initSidorEasterEgg();
  initHeader();
  initFAQ();

  if (!prefersReducedMotion) {
    initCursorDistortion();
    initTileHoverDistortion();
    initHeroGlitchText();
    initScrollReveal();
  } else {
    // Сразу показываем тайлы без анимации
    document.querySelectorAll('.features__tile').forEach(tile => {
      tile.classList.add('is-revealed');
    });
  }
});

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  if (!modal || !iframe) return;
  const content = modal.querySelector('.video-modal__content');
  if (!content) return;

  const overlay = modal.querySelector('.video-modal__overlay');
  const closeBtn = modal.querySelector('.video-modal__close');
  let triggerBtn = null;

  document.querySelectorAll('.about__video-overlay').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerBtn = btn;
      const container = btn.closest('.about__video');
      const videoId = container.dataset.videoId;
      const start = container.dataset.videoStart || 0;
      iframe.src = `https://www.youtube.com/embed/${videoId}?si=u-pcf_sWomP55a6B&autoplay=1&start=${start}`;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');

      content.focus();
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';

    if (triggerBtn) {
      triggerBtn.focus();
      triggerBtn = null;
    }
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initAuthModal() {
  const modal = document.getElementById('authModal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('#btnOpenAuth, #btnOpenAuthMobile, #btnOpenAuthEditions');
  const closeBtn = modal.querySelector('.auth-modal__close');
  const overlay = modal.querySelector('.auth-modal__overlay');
  const screens = modal.querySelectorAll('.auth-modal__screen');
  const links = modal.querySelectorAll('[data-target]');
  let lastFocusedBtn = null;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lastFocusedBtn = btn;
      switchScreen('login');
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocusedBtn) {
      lastFocusedBtn.focus();
    }
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  function switchScreen(targetScreen) {
    screens.forEach(screen => {
      if (screen.dataset.screen === targetScreen) {
        screen.classList.add('is-active');
      } else {
        screen.classList.remove('is-active');
      }
    });
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      if (target) {
        switchScreen(target);
      }
    });
  });

  function clearErrors(form) {
    const groups = form.querySelectorAll('.auth-form__group');
    groups.forEach(group => group.classList.remove('is-invalid'));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, show) {
    const group = input.closest('.auth-form__group');
    if (group) {
      if (show) group.classList.add('is-invalid');
      else group.classList.remove('is-invalid');
    }
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(loginForm);
      let isValid = true;
      const email = loginForm.email;
      const password = loginForm.password;

      if (!email.value || !validateEmail(email.value)) {
        showError(email, true);
        isValid = false;
      }
      if (!password.value) {
        showError(password, true);
        isValid = false;
      }

      if (isValid) {
        console.log('Login submitted', { email: email.value });
        closeModal();
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(registerForm);
      let isValid = true;
      const email = registerForm.email;
      const nickname = registerForm.nickname;
      const password = registerForm.password;
      const terms = registerForm.terms;

      if (!email.value || !validateEmail(email.value)) {
        showError(email, true);
        isValid = false;
      }
      if (!nickname.value.trim()) {
        showError(nickname, true);
        isValid = false;
      }
      if (!password.value) {
        showError(password, true);
        isValid = false;
      }
      if (!terms.checked) {
        showError(terms, true);
        isValid = false;
      }

      if (isValid) {
        console.log('Register submitted', { email: email.value, nickname: nickname.value });
        switchScreen('login');
      }
    });
  }

  const forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(forgotForm);
      let isValid = true;
      const email = forgotForm.email;

      if (!email.value || !validateEmail(email.value)) {
        showError(email, true);
        isValid = false;
      }

      if (isValid) {
        console.log('Forgot password submitted', { email: email.value });
        switchScreen('forgotPasswordSuccess');
      }
    });
  }

}

function initResetPasswordPage() {
  const container = document.getElementById('resetPasswordContainer');
  if (!container) return;

  const screens = container.querySelectorAll('.auth-modal__screen');
  const resetForm = document.getElementById('resetForm');

  function switchScreen(targetScreen) {
    screens.forEach(screen => {
      if (screen.dataset.screen === targetScreen) {
        screen.classList.add('is-active');
      } else {
        screen.classList.remove('is-active');
      }
    });
  }

  function clearErrors(form) {
    const groups = form.querySelectorAll('.auth-form__group');
    groups.forEach(group => group.classList.remove('is-invalid'));
  }

  function showError(input, show) {
    const group = input.closest('.auth-form__group');
    if (group) {
      if (show) group.classList.add('is-invalid');
      else group.classList.remove('is-invalid');
    }
  }

  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(resetForm);
      let isValid = true;
      const newPassword = resetForm.newPassword;
      const confirmPassword = resetForm.confirmPassword;

      if (!newPassword.value) {
        showError(newPassword, true);
        isValid = false;
      }
      if (!confirmPassword.value || newPassword.value !== confirmPassword.value) {
        showError(confirmPassword, true);
        isValid = false;
      }

      if (isValid) {
        console.log('Reset password submitted');
        switchScreen('resetPasswordSuccess');
      }
    });
  }
}

function initEditionsModal() {
  const modal = document.getElementById('editionsModal');
  if (!modal) return;
  const cards = document.querySelectorAll('.editions__card, #btnOpenEditionsBanner');
  const content = modal.querySelector('.editions-modal__content');
  if (!cards.length || !content) return;

  const overlay = modal.querySelector('.editions-modal__overlay');
  const closeBtn = modal.querySelector('.editions-modal__close');
  const tabs = modal.querySelectorAll('.editions-modal__tab');
  const priceEl = document.getElementById('editionsPrice');
  const galleryItems = modal.querySelectorAll('.editions-gallery__item');
  const featureItems = modal.querySelectorAll('.editions-modal__feature');
  let lastFocusedCard = null;

  const tierHierarchy = {
    'standard': 1,
    'deluxe': 2,
    'ultimate': 3
  };

  const prices = {
    'standard': '350 ₽',
    'deluxe': '840 ₽',
    'ultimate': '1090 ₽'
  };

  function updateModalState(targetTier) {
    // Update active tab styling
    tabs.forEach(tab => {
      if (tab.dataset.target === targetTier) {
        tab.classList.add('editions-modal__tab--active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('editions-modal__tab--active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Update Price
    if (priceEl && prices[targetTier]) {
      priceEl.textContent = prices[targetTier];
    }
    
    // Update Cashback Text
    const cashbackTextEl = modal.querySelector('#editionsCashbackText');
    if (cashbackTextEl) {
      if (targetTier === 'standard') cashbackTextEl.textContent = '350 ₽ от стоимости начисляются на донатный счет';
      if (targetTier === 'deluxe') cashbackTextEl.textContent = '840 ₽ от стоимости начисляются на донатный счет';
      if (targetTier === 'ultimate') cashbackTextEl.textContent = '1090 ₽ от стоимости начисляются на донатный счет';
    }

    // Update Description
    const descEl = modal.querySelector('#editionsDesc');
    if (descEl) {
      if (targetTier === 'standard') descEl.textContent = 'Стартовое издание раннего доступа для тех, кто хочет поддержать проект и войти в игру с самого начала.';
      if (targetTier === 'deluxe') descEl.textContent = 'Расширенное издание раннего доступа с дополнительными эксклюзивными наградами для тех, кто хочет получить больше на старте.';
      if (targetTier === 'ultimate') descEl.textContent = 'Максимальное издание раннего доступа с полным набором эксклюзивных наград, доступом к тестированию обновлений и изданием «Периметр» для друга.';
    }

    // Update disabled state for items and features
    const activeLevel = tierHierarchy[targetTier];
    
    // Update main image in gallery
    const mainImgEl = modal.querySelector('.editions-gallery__main img');
    if (mainImgEl) {
      if (targetTier === 'standard') mainImgEl.src = './assets/img/edition1.png';
      if (targetTier === 'deluxe') mainImgEl.src = './assets/img/edition2.png';
      if (targetTier === 'ultimate') mainImgEl.src = './assets/img/edition3.png';
    }

    galleryItems.forEach(item => {
      const itemTier = item.dataset.tier;
      if (tierHierarchy[itemTier] > activeLevel) {
        item.classList.add('is-disabled');
      } else {
        item.classList.remove('is-disabled');
      }
    });

    featureItems.forEach(item => {
      const itemTier = item.dataset.tier;
      if (tierHierarchy[itemTier] > activeLevel) {
        item.classList.add('is-disabled');
      } else {
        item.classList.remove('is-disabled');
      }
    });
  }

  // Open modal when clicking a card
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      lastFocusedCard = card;
      
      let targetTier = card.dataset.openTier || 'ultimate';
      if (card.classList.contains('editions__card--standard')) targetTier = 'standard';
      if (card.classList.contains('editions__card--deluxe')) targetTier = 'deluxe';
      if (card.classList.contains('editions__card--ultimate')) targetTier = 'ultimate';

      updateModalState(targetTier);

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      content.focus();
    });
  });

  // Cross-highlighting logic
  galleryItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('is-highlighted');
      if (featureItems[index]) featureItems[index].classList.add('is-highlighted');
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-highlighted');
      if (featureItems[index]) featureItems[index].classList.remove('is-highlighted');
    });
  });

  featureItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('is-highlighted');
      if (galleryItems[index]) galleryItems[index].classList.add('is-highlighted');
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-highlighted');
      if (galleryItems[index]) galleryItems[index].classList.remove('is-highlighted');
    });
  });

  // Tab switching logic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      updateModalState(tab.dataset.target);
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    if (lastFocusedCard) {
      lastFocusedCard.focus();
    }
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initHeroGlitchText() {
  const btn = document.getElementById('btnOpenAuth');
  if (!btn) return;

  const textEl = btn.querySelector('.hero__cta-text');
  if (!textEl) return;

  const originalText = textEl.textContent.trim();

  const chars = '!<>-_\\\\/[]{}вЂ”=+*^?#________';

  let scrambleInterval;
  let decipherInterval;

  btn.addEventListener('mouseenter', () => {

    const currentWidth = textEl.offsetWidth;
    textEl.style.minWidth = `${currentWidth}px`;
    textEl.style.display = 'flex';

    clearInterval(scrambleInterval);
    clearInterval(decipherInterval);

    scrambleInterval = setInterval(() => {
      textEl.textContent = originalText.split('').map((char) => {
        if (char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
    }, 40);
  });

  btn.addEventListener('mouseleave', () => {
    clearInterval(scrambleInterval);
    clearInterval(decipherInterval);

    let iteration = 0;

    decipherInterval = setInterval(() => {
      textEl.textContent = originalText.split('').map((char, index) => {

        if (index < iteration) {
          return originalText[index];
        }
        if (char === ' ') return ' ';

        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      if (iteration >= originalText.length) {
        clearInterval(decipherInterval);
        textEl.style.minWidth = '';
      }

      iteration += 1;
    }, 30);
  });
}

function initCursorDistortion() {
  const distortion = document.querySelector('.cursor-distortion');
  if (!distortion) return;

  if ('ontouchstart' in window) {
    distortion.remove();
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  const ease = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!distortion.classList.contains('is-active')) {
      distortion.classList.add('is-active');
    }
  });

  document.addEventListener('mouseleave', () => {
    distortion.classList.remove('is-active');
  });

  function animate() {
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    distortion.style.left = currentX + 'px';
    distortion.style.top = currentY + 'px';

    requestAnimationFrame(animate);
  }

  animate();
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

function initTileHoverDistortion() {
  const tiles = document.querySelectorAll('.features__tile, .editions__card, .account-tile');
  const svgDefs = document.querySelector('svg.sr-only defs');
  if (!tiles.length || !svgDefs) return;

  const maxScale = 35;

  tiles.forEach((tile, index) => {
    const img = tile.querySelector('.features__tile-img, .editions__card-cover, .account-tile__bg');
    const filterId = `distort-tile-hover-${index}`;
    const mapId = `displacement-hover-${index}`;

    const filterHTML = `
      <filter id="${filterId}" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="1" result="noise" />
        <feDisplacementMap id="${mapId}" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    `;
    svgDefs.insertAdjacentHTML('beforeend', filterHTML);

    const displacementMap = document.getElementById(mapId);

    img.style.filter = '';

    let isHovered = false;
    let currentScale = 0;
    let animationFrame;

    const animate = () => {
      const targetScale = isHovered ? maxScale : 0;

      if (isHovered && img.style.filter === '') {
        img.style.filter = `url(#${filterId})`;
      }

      currentScale += (targetScale - currentScale) * (isHovered ? 0.015 : 0.01);

      displacementMap.setAttribute('scale', currentScale);

      if (Math.abs(targetScale - currentScale) > 0.1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        displacementMap.setAttribute('scale', targetScale);

        if (!isHovered) {
          img.style.filter = '';
        }
      }
    };

    tile.addEventListener('mouseenter', () => {
      isHovered = true;
      cancelAnimationFrame(animationFrame);
      animate();
    });

    tile.addEventListener('mouseleave', () => {
      isHovered = false;
      cancelAnimationFrame(animationFrame);
      animate();
    });
  });
}

function initScrollReveal() {
  const tiles = document.querySelectorAll('.features__tile');
  const svgDefs = document.querySelector('svg.sr-only defs');
  if (!tiles.length || !svgDefs) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const tile = entry.target;
        const index = Array.from(tiles).indexOf(tile);
        const delay = index * 150;

        const filterId = `distort-reveal-${index}`;
        const mapId = `displacement-reveal-${index}`;

        const filterHTML = `
          <filter id="${filterId}" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="1" result="noise" />
            <feDisplacementMap id="${mapId}" in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        `;
        svgDefs.insertAdjacentHTML('beforeend', filterHTML);

        const displacementMap = document.getElementById(mapId);

        setTimeout(() => {

          tile.style.filter = `url(#${filterId})`;
          tile.classList.add('is-revealed');

          let currentScale = 150;
          let animationFrame;

          const animateReveal = () => {

            currentScale += (0 - currentScale) * 0.02;
            displacementMap.setAttribute('scale', currentScale);

            if (currentScale > 0.5) {
              animationFrame = requestAnimationFrame(animateReveal);
            } else {
              displacementMap.setAttribute('scale', 0);
              tile.style.filter = '';
            }
          };

          animateReveal();
        }, delay);

        observer.unobserve(tile);
      }
    });
  }, observerOptions);

  tiles.forEach(tile => {
    observer.observe(tile);
  });
}

function initSidorEasterEgg() {
  const egg = document.getElementById('sidorEasterEgg');
  const footer = document.getElementById('footer');
  if (!egg || !footer) return;

  if (sessionStorage.getItem('sidorShown')) {
    egg.remove();
    return;
  }

  const observer = new IntersectionObserver((entries, observerObj) => {
    entries.forEach(entry => {

      if (entry.isIntersecting) {

        setTimeout(() => {
          egg.classList.add('is-visible');
          egg.setAttribute('aria-hidden', 'false');
          sessionStorage.setItem('sidorShown', 'true');
        }, 500);

        setTimeout(() => {
          egg.classList.remove('is-visible');
          egg.setAttribute('aria-hidden', 'true');

          setTimeout(() => {
            egg.remove();
          }, 1000);
        }, 4500);

        observerObj.unobserve(footer);
      }
    });
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(footer);
}

function initHeader() {
  const header = document.getElementById('header');
  const btnBurger = document.getElementById('btnBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!header || !btnBurger || !mobileMenu) return;

  const isFaqPage = document.body.classList.contains('page-faq');

  // Show header on scroll
  window.addEventListener('scroll', () => {
    if (isFaqPage || window.scrollY > 50) {
      header.classList.add('header--visible');
    } else {
      header.classList.remove('header--visible');
    }
  }, { passive: true });

  // Check initial state
  if (isFaqPage || window.scrollY > 50) {
    header.classList.add('header--visible');
  }

  // Toggle mobile menu
  btnBurger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    if (isOpen) {
      mobileMenu.classList.remove('is-open');
      header.classList.remove('is-menu-open');
      btnBurger.classList.remove('is-active');
      btnBurger.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.add('is-open');
      header.classList.add('is-menu-open');
      btnBurger.classList.add('is-active');
      btnBurger.setAttribute('aria-expanded', 'true');
    }
  });

  // Close mobile menu when a link is clicked
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta, .hero__cta');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      header.classList.remove('is-menu-open');
      btnBurger.classList.remove('is-active');
      btnBurger.setAttribute('aria-expanded', 'false');
    });
  });
}

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq__item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq__trigger');
    const answer = item.querySelector('.faq__answer');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      // Close all other items (optional, but usually better for UX)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-active')) {
          const otherTrigger = otherItem.querySelector('.faq__trigger');
          const otherAnswer = otherItem.querySelector('.faq__answer');
          otherItem.classList.remove('is-active');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherAnswer.setAttribute('aria-hidden', 'true');
          otherAnswer.style.height = '0';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('is-active');
        trigger.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answer.style.height = '0';
      } else {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        answer.style.height = answer.scrollHeight + 'px';
      }
    });
  });

  // Handle window resize to update height if open
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('is-active')) {
        const answer = item.querySelector('.faq__answer');
        answer.style.height = answer.scrollHeight + 'px';
      }
    });
  });
}
