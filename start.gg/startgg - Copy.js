require('dotenv').config();
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

// Fetch event ID based on tournament and event slugs
const getEventId = async (tournamentName, eventName) => {
    const eventSlug = `tournament/${tournamentName}/event/${eventName}`;

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
                    query EventQuery($slug: String) {
                        event(slug: $slug) {
                            id
                            name
                        }
                    }
                `,
                variables: { slug: eventSlug }
            })
        });

        const data = await res.json();

        if (data.errors) {
            console.error("GraphQL error:", data.errors);
            return;
        }

        const eventId = data.data.event.id;
        console.log("Event ID:", eventId);

        // After we get the event ID, fetch the completed matches
        await getCompletedMatches(eventId);

    } catch (err) {
        console.error("Request failed:", err);
    }
};

// Fetch completed matches for an event by ID
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
            return;
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

        console.log("Completed Sets:", JSON.stringify(results, null, 2));

        // Save results to a JSON file
        fs.writeFileSync('completed_sets.json', JSON.stringify(results, null, 2));
        console.log("Saved to completed_sets.json");

    } catch (err) {
        console.error("Error fetching sets:", err);
    }
};

// Run the function with your tournament and event slugs
getEventId(
    'dq-retro-tekken-8-ball-bi-monthly-tournament-3-online',
    'tekken-8-ball-double-elimination'
);
