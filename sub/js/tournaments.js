fetch('sub/data/tournaments.json')
  .then(res => {
    if (!res.ok) {
      throw new Error(`Failed to fetch tournaments: ${res.status} ${res.statusText}`);
    }
    return res.json();
  })
  .then(data => {
    const container = document.getElementById('tournament-list');
    container.innerHTML = '';

    const filtered = data.filter(t =>
      /Tekken Ball|Tekken 8 Ball|Tekken 3 Ball|Tag 2 Ball/i.test(t.title)
    );

    if (filtered.length === 0) {
      container.innerHTML = '<p>No matching tournaments found.</p>';
      return;
    }

    filtered.forEach(t => {
      const div = document.createElement('div');
      div.className = 'tournament';
      div.innerHTML = `
        <h4>${t.title}</h4>
        <p><strong>Date:</strong> ${t.date}</p>
        ${t.location ? `<p><strong>Location:</strong> ${t.location}</p>` : ''}
        ${t.description ? `<p>${t.description}</p>` : ''}
      `;
      container.appendChild(div);
    });
  })
  .catch(error => {
    console.error('Error loading tournaments:', error);
    const container = document.getElementById('tournament-list');
    if (container) {
      container.innerHTML = '<p>Error loading tournaments.</p>';
    }
  });
