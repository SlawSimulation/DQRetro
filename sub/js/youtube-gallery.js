// Load LightGallery CSS
const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = 'https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css';
document.head.appendChild(css);

// Load and initialize LightGallery with video plugin
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

(async () => {
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/lightgallery.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/video/lg-video.min.js');

    const ytGallery = document.getElementById('lightgallery');
    if (ytGallery) {
      lightGallery(ytGallery, {
        plugins: [lgVideo],
        speed: 500,
      });
    }
  } catch (err) {
    console.error('Failed to load YouTube gallery JS:', err);
  }
})();
