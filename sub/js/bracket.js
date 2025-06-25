// Utility: group matches into rounds (for demo, grouping every 2 matches as a round)
function groupMatchesIntoRounds(matches) {
  const rounds = [];
  let currentRound = [];
  for (let i = 0; i < matches.length; i++) {
    currentRound.push(matches[i]);
    if (currentRound.length === 2 || i === matches.length -1) {
      rounds.push(currentRound);
      currentRound = [];
    }
  }
  return rounds;
}

// Render a single match
function renderMatch(match, matchIndex) {
  const div = document.createElement('div');
  div.classList.add('item');

  const player1Name = match.players[0]?.gamerTag || "Unknown";
  const player2Name = match.players[1]?.gamerTag || "Unknown";

  div.innerHTML = `
    <div class="box">
      <div class="part partOne">
        <div class="value">${player1Name}</div>
        <div class="score">0</div>
      </div>
      <div class="part partTwo">
        <div class="value">${player2Name}</div>
        <div class="score">0</div>
      </div>
    </div>
    <div class="bracket"><span></span></div>
  `;

  return div;
}

// Main function to build the bracket
function buildBracket(matches) {
  const bracketContainer = document.getElementById('bracket');
  bracketContainer.innerHTML = ''; // Clear any existing content

  // Group matches into rounds
  const rounds = groupMatchesIntoRounds(matches);

  rounds.forEach((roundMatches, roundIndex) => {
    const column = document.createElement('div');
    column.classList.add('column');

    // Round title
    const roundTitle = document.createElement('h3');
    roundTitle.classList.add('round-title');
    roundTitle.textContent = `Round ${roundIndex + 1}`;
    column.appendChild(roundTitle);

    // Render each match
    roundMatches.forEach((match, idx) => {
      const matchDiv = renderMatch(match, idx);
      column.appendChild(matchDiv);
    });

    bracketContainer.appendChild(column);
  });
}

// Fetch JSON and build bracket
fetch('sub/data/tournaments_completed_sets.json')
  .then(res => res.json())
  .then(data => {
    buildBracket(data);
  })
  .catch(err => {
    console.error("Error loading bracket data:", err);
    document.getElementById('bracket').textContent = 'Failed to load bracket data.';
  });
