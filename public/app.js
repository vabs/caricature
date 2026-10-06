const form = document.querySelector('#caricature-form');
const fileInput = document.querySelector('#image');
const fileName = document.querySelector('#file-name');
const statusEl = document.querySelector('#status');
const button = document.querySelector('#generate-button');
const resultImage = document.querySelector('#result-image');
const downloadLink = document.querySelector('#download-link');
const styleSelect = document.querySelector('#style-select');
const styleDescription = document.querySelector('#style-description');
let styles = [];

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

fileInput.addEventListener('change', () => {
  fileName.textContent = fileInput.files[0]?.name ?? 'JPEG, PNG, or WebP up to 10 MB';
});

function updateStyleDescription() {
  const selectedStyle = styles.find((style) => style.id === styleSelect.value);
  styleDescription.textContent = selectedStyle?.description ?? 'Choose a caricature style.';
}

function renderStyleOptions(items) {
  styles = items;
  styleSelect.replaceChildren(...items.map((item) => {
    const option = document.createElement('option');

    option.value = item.id;
    option.textContent = item.label;

    return option;
  }));
  styleSelect.disabled = false;
  updateStyleDescription();
}

async function loadCatalogs() {
  try {
    const stylesResponse = await fetch('/api/styles');
    const stylesPayload = await stylesResponse.json();

    if (!stylesResponse.ok) {
      throw new Error('Unable to load generation options.');
    }

    renderStyleOptions(stylesPayload.styles);
    button.disabled = false;
  } catch (error) {
    setStatus(error.message, true);
  }
}

styleSelect.addEventListener('change', updateStyleDescription);

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
    setStatus('Caricature ready.');
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    button.disabled = false;
  }
});

loadCatalogs();
