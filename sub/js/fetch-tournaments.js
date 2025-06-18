import fetch from 'node-fetch';
import fs from 'fs/promises';

const API_URL = 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

if (!API_KEY) {
  console.error('Error: STARTGG_API_KEY environment variable is not set.');
  process.exit(1);
}

const query = `
  query Tournaments($perPage: Int!) {
    tournaments(query: {perPage: $perPage}) {
      nodes {
        name
        slug
        startAt
        city
        countryCode
        online
      }
    }
  }
`;

async function fetchTournaments() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        query,
        variables: { perPage: 10 }
      })
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error('GraphQL errors: ' + JSON.stringify(json.errors));
    }

    return json.data.tournaments.nodes;
  } catch (error) {
    console.error('Failed to fetch tournaments:', error);
    return [];
  }
}

async function saveTournamentsToFile(tournaments) {
  try {
    const filePath = './sub/data/tournaments.json';
    await fs.writeFile(filePath, JSON.stringify(tournaments, null, 2), 'utf-8');
    console.log(`Successfully wrote ${tournaments.length} tournaments to ${filePath}`);
  } catch (error) {
    console.error('Failed to write tournaments.json:', error);
  }
}

async function main() {
  const tournaments = await fetchTournaments();
  await saveTournamentsToFile(tournaments);
}

main();
