fetch('sub/data/tournaments.json')
  .then(res => {
    if (!res.ok) {
      throw new Error(`Failed to fetch tournaments: ${res.status} ${res.statusText}`);
    }
    return res.json();
  })
  .then(data => {
    console.log('Tournaments fetched:', data);

    // TODO: Display tournaments from data
    // Example: renderTournaments(data);
  })
  .catch(error => {
    console.error('Error loading tournaments:', error);
    // TODO: Show user-friendly error message in UI
  });
