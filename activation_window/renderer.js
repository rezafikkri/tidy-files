import '../src/index.css';

const input = document.querySelector('input[type="text"]');
const button = document.querySelector('button#active');
const loading = button.querySelector('svg#loading');
const span = button.querySelector('span');
const alert = document.querySelector('#alert');
const alertMessage = document.querySelector('#alert-message');
const alertCloseBtn = alert.querySelector('#alert-close');

button.addEventListener('click', async () => {
  // show loading
  loading.classList.replace('hidden', 'inline');
  span.classList.replace('inline', 'hidden');

  const activationKey = input.value;
  const response = await window.activation.active(activationKey);
  if (response.status === 'invalid') {
    alertMessage.innerText = response.message;
    alert.classList.replace('hidden', 'flex');
  }

  // hide loading
  loading.classList.replace('inline', 'hidden');
  span.classList.replace('hidden', 'inline');
});

alertCloseBtn.addEventListener('click', () => {
  alert.classList.replace('flex', 'hidden');
});
