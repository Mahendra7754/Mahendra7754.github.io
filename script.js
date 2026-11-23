const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(other => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = filter !== 'all' && !card.dataset.tags.split(' ').includes(filter);
  });
}));

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const lightbox = document.querySelector('#image-lightbox');
if (lightbox) {
  const image = lightbox.querySelector('img');
  document.querySelectorAll('.zoom-media').forEach(button => button.addEventListener('click', () => {
    image.src = button.dataset.full;
    image.alt = button.dataset.caption || 'Expanded project image';
    lightbox.querySelector('p').textContent = button.dataset.caption || '';
    lightbox.showModal();
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', () => image.removeAttribute('src'));
}

const autoplayVideos = [...document.querySelectorAll('video[data-autoplay]')];
if (autoplayVideos.length) {
  const visibleVideos = new Set();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updatePlayback = video => {
    if (visibleVideos.has(video) && !document.hidden && !reducedMotion.matches) {
      video.muted = true;
      video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleVideos.add(entry.target);
        else visibleVideos.delete(entry.target);
        updatePlayback(entry.target);
      });
    }, { threshold: 0.35 });
    autoplayVideos.forEach(video => observer.observe(video));
  } else {
    autoplayVideos.forEach(video => {
      visibleVideos.add(video);
      updatePlayback(video);
    });
  }

  document.addEventListener('visibilitychange', () => autoplayVideos.forEach(updatePlayback));
  reducedMotion.addEventListener?.('change', () => autoplayVideos.forEach(updatePlayback));
}
