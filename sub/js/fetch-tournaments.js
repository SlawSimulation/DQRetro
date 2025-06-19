const fs = require('fs');
const fetch = require('node-fetch');

const query = `
query {
  tournaments(query: {
    perPage: 20,
    page: 1,
    filter: {
      name: "Ball"
    }
  }) {
    nodes {
      name
      startAt
      city
      url
    }
  }
}
`;

fetch('https://api.start.gg/gql/alpha', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.STARTGG_TOKEN}`
  },
  body: JSON.stringify({ query })
})
  .then(res => res.json())
  .then(data => {
    const tournaments = data.data.tournaments.nodes.filter(t =>
      /Tekken Ball|Tekken 8 Ball|Tekken 3 Ball|Tag 2 Ball/i.test(t.name)
    );

    fs.writeFileSync('sub/data/tournaments.json', JSON.stringify(tournaments, null, 2));
    console.log('Tournaments saved to sub/data/tournaments.json');
  })
  .catch(err => {
    console.error('Failed to fetch tournaments:', err);
    process.exit(1);
  });
