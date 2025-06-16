// Load LightGallery CSS
const lgCss = document.createElement('link');
lgCss.rel = 'stylesheet';
lgCss.href = 'https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css';
document.head.appendChild(lgCss);

// Helper loader
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

// Load core and plugins, then init gallery
(async function() {
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/lightgallery.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/zoom/lg-zoom.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/thumbnail/lg-thumbnail.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/fullscreen/lg-fullscreen.min.js');

    const gallery = document.getElementById('lightgallery-images');
    if (!gallery) throw new Error('Container #lightgallery-images not found');

    lightGallery(gallery, {
      plugins: [lgZoom, lgThumbnail, lgFullscreen],
      speed: 500,
      download: false,
      selector: 'a',
      zoom: true,
      actualSize: true,
      thumbnail: true,
      fullscreen: true,
    });
  } catch (err) {
    console.error('Photo gallery failed to initialize:', err);
  }
})();
