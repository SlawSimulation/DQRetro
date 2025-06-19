document.addEventListener('DOMContentLoaded', () => {
  const gameGrid = document.getElementById('game-grid');
  const searchInput = document.getElementById('game-search');
  let games = [];

  async function loadGames() {
    try {
      const response = await fetch('../../data/retrogamesdb.json'); // adjust if needed
      if (!response.ok) throw new Error('Failed to load retrogamesdb.json');
      games = await response.json();
      renderGames();
    } catch (error) {
      gameGrid.innerHTML = `<p style="color: red;">Error loading games data: ${error.message}</p>`;
    }
  }

  function renderGames(filter = '') {
    const filteredGames = games.filter(game =>
      game.title.toLowerCase().includes(filter.toLowerCase()) ||
      game.genre.toLowerCase().includes(filter.toLowerCase()) ||
      game.platform.toLowerCase().includes(filter.toLowerCase())
    );

    gameGrid.innerHTML = filteredGames.map(game => `
      <article class="game-card" tabindex="0">
        <img class="game-image" src="${game.image}" alt="${game.title} Box Art" />
        <h2 class="game-title">${game.title}</h2>
        <div class="game-info">${game.year} &bull; ${game.genre} &bull; ${game.platform}</div>
        <div class="game-info">Netplay: ${game.netplay}</div>
        <p class="game-description">${game.description}</p>
        <a href="${fandom.wiki}" class="setup-link" target="_blank" rel="noopener">View Wiki</a>
      </article>
    `).join('');
  }

  searchInput.addEventListener('input', (e) => {
    renderGames(e.target.value);
  });

  loadGames();
});
