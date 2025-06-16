// Dynamically load LightGallery CSS
const lgCss = document.createElement('link');
lgCss.rel = 'stylesheet';
lgCss.href = 'https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css';
document.head.appendChild(lgCss);

// Helper function to load external scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Initialize YouTube and Image galleries
async function initGalleries() {
  try {
    // Load LightGallery core
    await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/lightgallery.min.js');

    // If YouTube gallery is present, load the video plugin too
    const youtubeGallery = document.getElementById('lightgallery');
    if (youtubeGallery) {
      await loadScript('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/video/lg-video.min.js');
      lightGallery(youtubeGallery, {
        plugins: [lgVideo],
        speed: 500,
      });
    }

    // Init Image gallery if present
    const imageGallery = document.getElementById('lightgallery-images');
    if (imageGallery) {
      lightGallery(imageGallery, {
        speed: 500,
        download: false,
      });
    }

  } catch (error) {
    console.error('❌ Failed to load LightGallery or initialize galleries:', error);
  }
}

// Wait for DOM content to be fully loaded before running
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGalleries);
} else {
  initGalleries();
}
