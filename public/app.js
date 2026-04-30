const form = document.querySelector('#caricature-form');
const fileInput = document.querySelector('#image');
const fileName = document.querySelector('#file-name');
const statusEl = document.querySelector('#status');
const button = document.querySelector('#generate-button');
const resultImage = document.querySelector('#result-image');
const placeholder = document.querySelector('#placeholder');
const downloadLink = document.querySelector('#download-link');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

fileInput.addEventListener('change', () => {
  fileName.textContent = fileInput.files[0]?.name ?? 'JPEG, PNG, or WebP up to 10 MB';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!fileInput.files[0]) {
    setStatus('Choose an image first.', true);
    return;
  }

  const body = new FormData(form);
  button.disabled = true;
  setStatus('Generating caricature...');

  try {
    const response = await fetch('/api/caricatures', {
      method: 'POST',
      body
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message ?? 'Unable to generate caricature.');
    }

    const dataUrl = `data:${payload.mimeType};base64,${payload.imageBase64}`;
    resultImage.src = dataUrl;
    downloadLink.href = dataUrl;
    resultImage.hidden = false;
    downloadLink.hidden = false;
    placeholder.hidden = true;
    setStatus('Caricature ready.');
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    button.disabled = false;
  }
});
