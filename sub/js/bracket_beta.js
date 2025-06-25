fetch('completed_tournaments_sets.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('content');
    container.innerHTML = ''; // Clear loading text

    if (!data.length) {
      container.textContent = 'No tournament data found.';
      return;
    }

    data.forEach(tourney => {
      const tourneyDiv = document.createElement('div');
      tourneyDiv.className = 'tournament';

      const title = document.createElement('h2');
      title.textContent = tourney.tournament;
      tourneyDiv.appendChild(title);

      // Group matches by event (in case multiple events per tournament)
      // If your data structure is different, adjust accordingly
      // Here, each "tourney" has "event" and "completedMatches" array
      const eventTitle = document.createElement('h3');
      eventTitle.textContent = tourney.event;
      eventTitle.className = 'event';
      tourneyDiv.appendChild(eventTitle);

      tourney.completedMatches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';

        const playersDiv = document.createElement('div');
        playersDiv.className = 'players';

        match.players.forEach(player => {
          const playerDiv = document.createElement('div');
          playerDiv.textContent = player.gamerTag || player.name;
          playersDiv.appendChild(playerDiv);
        });

        matchDiv.appendChild(playersDiv);
        tourneyDiv.appendChild(matchDiv);
      });

      container.appendChild(tourneyDiv);
    });
  })
  .catch(err => {
    console.error('Error loading tournament data:', err);
    document.getElementById('content').textContent = 'Failed to load tournament data.';
  });
