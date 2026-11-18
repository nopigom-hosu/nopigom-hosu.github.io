const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('.card-panel'));

function activateTab(tab) {
  tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  panels.forEach((panel) => {
    const active = panel.id === tab.dataset.target;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
  const carousel = document.querySelector(`#${tab.dataset.target} .carousel`);
  if (carousel) carousel.scrollLeft = 0;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    next.focus();
    activateTab(next);
  });
});

panels.forEach((panel) => {
  const carousel = panel.querySelector('.carousel');
  const slides = Array.from(panel.querySelectorAll('.slide'));
  const current = panel.querySelector('.carousel-status strong');

  function activeIndex() {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    slides.forEach((slide, index) => {
      const nextDistance = Math.abs(center - (slide.offsetLeft + slide.offsetWidth / 2));
      if (nextDistance < distance) { distance = nextDistance; nearest = index; }
    });
    return nearest;
  }

  function goToSlide(index) {
    const safeIndex = (index + slides.length) % slides.length;
    slides[safeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  panel.querySelector('.prev').addEventListener('click', () => goToSlide(activeIndex() - 1));
  panel.querySelector('.next').addEventListener('click', () => goToSlide(activeIndex() + 1));
  let scrollFrame;
  carousel.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => { current.textContent = String(activeIndex() + 1); });
  }, { passive: true });
});

const photoDialog = document.querySelector('.photo-lightbox');
const photoDialogImage = photoDialog?.querySelector('img');
const photoDialogCaption = photoDialog?.querySelector('p');
const photoDialogClose = photoDialog?.querySelector('.lightbox-close');

function openPhoto(image) {
  if (!photoDialog || !photoDialogImage || !photoDialogCaption) return;
  photoDialogImage.src = image.currentSrc || image.src;
  photoDialogImage.alt = image.alt;
  photoDialogCaption.textContent = image.alt;
  photoDialog.showModal();
}

document.querySelectorAll('[data-lightbox]').forEach((image) => {
  image.addEventListener('click', () => openPhoto(image));
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPhoto(image);
    }
  });
});

photoDialogClose?.addEventListener('click', () => photoDialog.close());
photoDialog?.addEventListener('click', (event) => {
  if (event.target === photoDialog) photoDialog.close();
});
