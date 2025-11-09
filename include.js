document.addEventListener('DOMContentLoaded', () => {
  const includes = document.querySelectorAll('[data-include]');
  const tasks = Array.from(includes).map(async (el) => {
    const url = el.getAttribute('data-include');
    if (!url) return;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch ${url}`);
      el.innerHTML = await resp.text();
    } catch (err) {
      console.error(err);
    }
  });

  Promise.all(tasks).then(() => {
    const page = document.body.dataset.page;
    if (page) {
      document
        .querySelectorAll('nav a[data-page]')
        .forEach((link) => {
          if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
    }
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  });
});
