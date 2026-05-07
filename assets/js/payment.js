'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPaymentSuccess();
});

/**
 * Обработка данных на странице успешной оплаты
 */
function initPaymentSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get('amount');
  const amountDisplay = document.getElementById('displayAmount');

  if (amount && amountDisplay) {
    // Форматируем число (добавляем пробелы между тысячами)
    const formattedAmount = Number(amount).toLocaleString('ru-RU');
    amountDisplay.textContent = formattedAmount + ' ₽';
  }

  console.log('Данные платежа успешно загружены');
}
