document.addEventListener('DOMContentLoaded', () => {
  const bracketContainer = document.getElementById('bracket-container');

  fetch('sub/data/tournaments_completed_sets.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load tournaments data');
      return res.json();
    })
    .then(data => {
      if (!data.length) {
        bracketContainer.textContent = 'No tournament data found.';
        return;
      }

      // Assume sets are in order and half of them belong to round 1, then next round, etc.
      // For demo: group sets into rounds (you'll want to adjust logic for your data)

      const rounds = groupSetsIntoRounds(data);

      // Clear loading text
      bracketContainer.textContent = '';

      rounds.forEach((roundSets, roundIndex) => {
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');
        roundDiv.innerHTML = `<h2>Round ${roundIndex + 1}</h2>`;

        roundSets.forEach(set => {
          const matchDiv = document.createElement('div');
          matchDiv.classList.add('match');

          if (set.winnerId) {
            matchDiv.classList.add('winner');
          }

          const playersHtml = set.players
            .map(p => `<div class="player">${p.gamerTag || p.name}</div>`)
            .join('');

          matchDiv.innerHTML = playersHtml;
          roundDiv.appendChild(matchDiv);
        });

        bracketContainer.appendChild(roundDiv);
      });
    })
    .catch(err => {
      bracketContainer.textContent = 'Error loading tournament data.';
      console.error(err);
    });

  // Simple grouping function - you might need to adapt this based on your set data structure
  function groupSetsIntoRounds(sets) {
    // For simplicity: group every 4 matches into one round (you can make this dynamic)
    const rounds = [];
    let chunkSize = 4;
    for (let i = 0; i < sets.length; i += chunkSize) {
      rounds.push(sets.slice(i, i + chunkSize));
      chunkSize = Math.max(1, chunkSize / 2); // next round has fewer matches
    }
    return rounds;
  }
});
