require('dotenv').config();
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

const SEARCH_QUERY = "Tekken Ball";  // keyword to search tournaments

// Search tournaments by name keyword
const searchTournaments = async (query, page = 1) => {
  try {
    const res = await fetch(startggURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: 'Bearer ' + startggKey
      },
      body: JSON.stringify({
        query: `
          query TournamentsQuery($query: String!, $page: Int) {
            tournaments(query: $query, page: $page, perPage: 10) {
              nodes {
                id
                name
                slug
                events {
                  id
                  name
                  slug
                }
              }
              pageInfo {
                totalPages
                total
              }
            }
          }
        `,
        variables: { query, page }
      })
    });

    const data = await res.json();

    if (data.errors) {
      console.error("GraphQL error searching tournaments:", data.errors);
      return null;
    }

    return data.data.tournaments;

  } catch (err) {
    console.error("Error searching tournaments:", err);
    return null;
  }
};

// Fetch completed matches for an event by ID (same as before)
const getCompletedMatches = async (eventId) => {
  try {
    const res = await fetch(startggURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: 'Bearer ' + startggKey
      },
      body: JSON.stringify({
        query: `
          query CompletedSets($eventId: ID!) {
            event(id: $eventId) {
              sets(page: 1, perPage: 10, filters: { state: 1 }) {
                nodes {
                  id
                  winnerId
                  slots {
                    entrant {
                      name
                      participants {
                        gamerTag
                        user {
                          id
                          discriminator
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { eventId }
      })
    });

    const data = await res.json();

    if (data.errors) {
      console.error("GraphQL error (sets):", data.errors);
      return null;
    }

    const sets = data.data.event.sets.nodes;

    // Map the data into a friendlier format
    const results = sets.map((set, index) => {
      const players = set.slots.map(slot => {
        const entrant = slot.entrant;
        return {
          name: entrant?.name || "Unknown",
          gamerTag: entrant?.participants?.[0]?.gamerTag || "Unknown",
          discordId: entrant?.participants?.[0]?.user?.id || null
        };
      });

      return {
        matchNumber: index + 1,
        setId: set.id,
        winnerId: set.winnerId,
        players
      };
    });

    return results;

  } catch (err) {
    console.error("Error fetching sets:", err);
    return null;
  }
};

const main = async () => {
  let page = 1;
  const allResults = [];

  while (true) {
    console.log(`Searching tournaments for "${SEARCH_QUERY}", page ${page}...`);
    const tournamentsData = await searchTournaments(SEARCH_QUERY, page);

    if (!tournamentsData) break;

    const tournaments = tournamentsData.nodes;
    if (tournaments.length === 0) {
      console.log("No more tournaments found.");
      break;
    }

    for (const tournament of tournaments) {
      console.log(`Found tournament: ${tournament.name} (slug: ${tournament.slug})`);

      // Filter events if you want, e.g., only double elimination events
      // Or fetch all events
      const relevantEvents = tournament.events.filter(e => e.name.toLowerCase().includes("double elimination") || e.name.toLowerCase().includes("tekken"));

      for (const event of relevantEvents) {
        console.log(`  Fetching matches for event: ${event.name} (ID: ${event.id})`);
        const completedMatches = await getCompletedMatches(event.id);

        if (completedMatches && completedMatches.length > 0) {
          allResults.push({
            tournament: tournament.name,
            tournamentSlug: tournament.slug,
            event: event.name,
            eventId: event.id,
            completedMatches
          });
        } else {
          console.log(`  No completed matches found for event ${event.name}`);
        }
      }
    }

    // Stop if we reached last page
    if (page >= tournamentsData.pageInfo.totalPages) {
      break;
    }
    page++;
  }

  // Save all results to JSON
  fs.writeFileSync('completed_tournaments_sets.json', JSON.stringify(allResults, null, 2));
  console.log("All results saved to completed_tournaments_sets.json");
};

main();
