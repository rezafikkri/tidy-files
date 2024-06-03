import '../src/index.css';

const input = document.querySelector('input[type="text"]');
const button = document.querySelector('button#active');
const alert = document.querySelector('#alert');
const alertMessage = document.querySelector('#alert-message');
const alertCloseBtn = alert.querySelector('#alert-close');

button.addEventListener('click', async () => {
  const activationKey = input.value;
  const response = await window.activation.active(activationKey);
  if (response.status === 'invalid') {
    alertMessage.innerText = response.message;
    alert.classList.replace('hidden', 'flex');
  }
});

alertCloseBtn.addEventListener('click', () => {
  alert.classList.replace('flex', 'hidden');
});
