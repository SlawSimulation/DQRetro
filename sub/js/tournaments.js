fetch('sub/data/tournaments.json')
  .then(res => res.json())
  .then(data => {
    // Display tournaments from data
  })
  .catch(() => {
    // Handle errors
  });