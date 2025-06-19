fetch('sub/data/tournaments.json')
  .then(res => res.json())
  .then(tournaments => {
    const container = document.getElementById('tournament-list');
    container.innerHTML = '';

    if (!tournaments.length) {
      container.innerHTML = '<p>No matching tournaments found.</p>';
      return;
    }

    tournaments.forEach(t => {
      const div = document.createElement('div');
      const date = new Date(t.startAt * 1000).toLocaleDateString();
      div.className = 'tournament';
      div.innerHTML = `
        <h4>${t.name}</h4>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>City:</strong> ${t.city ?? 'TBA'}</p>
        <a href="${t.url}" target="_blank">View Tournament</a>
      `;
      container.appendChild(div);
    });
  })
  .catch(() => {
    document.getElementById('tournament-list').innerText = 'Error loading tournaments.';
  });
