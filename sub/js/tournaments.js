fetch('data/tournaments.json')
  .then(res => {
    if (!res.ok) throw new Error('Failed to load data');
    return res.json();
  })
  .then(data => {
    const container = document.getElementById('tournament-list');
    container.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p>No upcoming tournaments.</p>';
      return;
    }

    data.forEach(tournament => {
      const div = document.createElement('div');
      div.className = 'tournament';
      div.innerHTML = `
        <h2>${tournament.name}</h2>
        <p><strong>Date:</strong> ${tournament.startAtReadable || 'TBD'}</p>
        <p><strong>Location:</strong> ${tournament.venue || 'Online'}</p>
        <p><a href="${tournament.url}" target="_blank">View on Start.gg</a></p>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    document.getElementById('tournament-list').innerHTML =
      '<p>Error loading tournament data.</p>';
    console.error(err);
  });
