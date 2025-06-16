// Fetch the latest video from YouTube channel
const channelId = 'UC0N1HJjLqlPSzTLOwuLk2Sg';
const youtubePlayer = document.getElementById('youtube-player');

fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
  .then(response => response.json())
  .then(data => {
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].link.split('=')[1];
      youtubePlayer.innerHTML = `
        <iframe width="100%" height="315"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0" allowfullscreen></iframe>`;
    } else {
      youtubePlayer.innerHTML = "No videos found.";
    }
  })
  .catch(() => {
    youtubePlayer.innerHTML = "Failed to load video.";
  });
