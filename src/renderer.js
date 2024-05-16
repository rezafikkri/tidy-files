import './index.css';

const chooseFolderBtn = document.querySelector('button#choose-folder');
const tidingFilesBtn = document.querySelector('button#tiding-files');
const input = document.querySelector('input[type="text"]');
const loading = tidingFilesBtn.querySelector('svg#loading');
const span = tidingFilesBtn.querySelector('span');
const alert = document.querySelector('#alert');
const alertMessage = alert.querySelector('#alert-message');
const alertCloseBtn = alert.querySelector('#alert-close');

const chooseFolder = async () => {
  const response = await window.tidy.chooseFolder();
  if (response.canceled === false) {
    input.value = response.filePaths[0];
  }
};

const showAlert = (message, type = 'info') => {
  // reset alert style
  alert.classList.remove(
    'text-blue-800',
    'bg-blue-50',
    'text-red-800',
    'bg-red-50',
    'text-green-800',
    'bg-green-50',
  );
  alertCloseBtn.classList.remove(
    'bg-blue-50',
    'text-blue-500',
    'focus:ring-blue-400',
    'hover:bg-blue-200',
    'bg-red-50',
    'text-red-500',
    'focus:ring-red-400',
    'hover:bg-red-200',
    'bg-green-50',
    'text-green-500',
    'focus:ring-green-400',
    'hover:bg-green-200',
  );
  // set alert style
  if (type === 'info') {
    alert.classList.add('text-blue-800', 'bg-blue-50');
    alertCloseBtn.classList.add('bg-blue-50', 'text-blue-500', 'focus:ring-blue-400', 'hover:bg-blue-200');
  } else if (type === 'danger') {
    alert.classList.add('text-red-800', 'bg-red-50');
    alertCloseBtn.classList.add('bg-red-50', 'text-red-500', 'focus:ring-red-400', 'hover:bg-red-200');
  } else if (type === 'success') {
    alert.classList.add('text-green-800', 'bg-green-50');
    alertCloseBtn.classList.add('bg-green-50', 'text-green-500', 'focus:ring-green-400', 'hover:bg-green-200');
  }

  alertMessage.innerText = message;
  alert.classList.replace('hidden', 'flex');
};

const tidingFiles = async () => {
  if (input.value === '') {
    showAlert('Please select a folder first!');
    return;
  }

  const baseFolder = input.value;
  // show loading
  loading.classList.replace('hidden', 'inline');
  span.classList.replace('inline', 'hidden');
  const response = await window.tidy.tidingFiles(baseFolder);

  if (response.status === 'fail') {
    showAlert(response.message, 'danger');
  } else if (response.status === 'success') {
    showAlert('Tiding files success.', 'success');
  }

  // hide loading
  loading.classList.replace('inline', 'hidden');
  span.classList.replace('hidden', 'inline');
};

alertCloseBtn.addEventListener('click', () => alert.classList.replace('flex', 'hidden'));

chooseFolderBtn.addEventListener('click', () => chooseFolder());

tidingFilesBtn.addEventListener('click', () => tidingFiles());
