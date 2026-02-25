let mediaModal = document.getElementById('mediaModal');
let videoContainer = document.getElementById('videoContainer');
let youtubeVideo = document.getElementById('youtubeVideo');
let pdfContainer = document.getElementById('pdfContainer');
let pdfCanvas = document.getElementById('pdfCanvas');
let imageContainer = document.getElementById('imageContainer');
let modalImage = document.getElementById('modalImage');

let pdfDoc = null;
let pdfPageRendering = false;
let pdfPageNumPending = null;
let pdfPageNum = 1;

async function renderPDF(url) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const data = await fetch(url).then(r => r.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  pdfContainer.innerHTML = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.4 });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    pdfContainer.appendChild(canvas);

    await page.render({ canvasContext: ctx, viewport }).promise;
  }
}

function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        const ctx = pdfCanvas.getContext('2d');

        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;

        page.render({ canvasContext: ctx, viewport });
    });
}

// Show modal content
mediaModal.addEventListener('show.bs.modal', event => {
  let trigger = event.relatedTarget;
  let type = trigger.getAttribute('data-type');
  let src = trigger.getAttribute('data-src');

  // Hide all
  videoContainer.classList.add('d-none');
  pdfContainer.classList.add('d-none');
  imageContainer.classList.add('d-none');

  if(type === 'video'){
    videoContainer.classList.remove('d-none');
    const separator = src.includes('?') ? '&' : '?';
    youtubeVideo.src = src + separator + "autoplay=1&rel=0"; 
  }
  else if(type === 'pdf'){
    pdfContainer.classList.remove('d-none');
    renderPDF(src);
  }
  else if(type === 'image'){
    imageContainer.classList.remove('d-none');
    modalImage.src = src;
  }
});

// Clear modal content on close
mediaModal.addEventListener('hidden.bs.modal', () => {
  youtubeVideo.src = "";
  pdfDoc = null;
  pdfCanvas.getContext('2d').clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
  modalImage.src = "";
});

function closeTab() {
    // Attempt to close the current tab
    window.close();

      // If blocked → redirect
    setTimeout(() => {
        window.location.href = "about:blank";
    }, 100);
}