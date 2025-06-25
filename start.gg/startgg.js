require('dotenv').config();
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

if (!startggKey) {
    console.error("❌ Missing STARTGG_KEY in environment variables.");
    process.exit(1);
}

// Fetch event ID based on tournament and event slugs
const getEventId = async (tournamentName, eventName) => {
    const eventSlug = `tournament/${tournamentName}/event/${eventName}`;
    console.log(`🔍 Querying Start.gg for event: ${eventSlug}`);

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
            console.error("❌ GraphQL error:", JSON.stringify(data.errors, null, 2));
            return;
        }

        if (!data.data || !data.data.event) {
            console.error("❌ No event found. Check your tournament or event slugs.");
            console.log("📭 Raw response:", JSON.stringify(data, null, 2));
            return;
        }

        const eventId = data.data.event.id;
        console.log(`✅ Found Event ID: ${eventId} (${data.data.event.name})`);

        // Proceed to fetch completed sets
        await getCompletedMatches(eventId);

    } catch (err) {
        console.error("❌ Request failed:", err);
    }
};

// Fetch completed matches for an event by ID
const getCompletedMatches = async (eventId) => {
    console.log(`📦 Fetching completed sets for Event ID: ${eventId}`);

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
            console.error("❌ GraphQL error (sets):", JSON.stringify(data.errors, null, 2));
            return;
        }

        const sets = data.data?.event?.sets?.nodes || [];

        if (sets.length === 0) {
            console.log("ℹ️ No completed sets found for this event.");
            return;
        }

        const results = sets.map((set, index) => {
            const players = set.slots.map(slot => {
                const entrant = slot.entrant;
                return {
                    name: entrant?.name || "Unknown",
                    gamerTag: entrant?.participants?.[0]?.gamerTag || "Unknown",
                    discordId: entrant?.participants?.[0]?.user?.id || null,
                    twitchId: entrant?.participants?.[0]?.user?.id || null
                };
            });

            return {
                matchNumber: index + 1,
                setId: set.id,
                winnerId: set.winnerId,
                players
            };
        });

        console.log("✅ Completed Sets:\n", JSON.stringify(results, null, 2));

        fs.writeFileSync('completed_sets.json', JSON.stringify(results, null, 2));
        console.log("💾 Saved results to completed_sets.json");

    } catch (err) {
        console.error("❌ Error fetching sets:", err);
    }
};

// Start the fetch process
getEventId(
    'dq-retro-tekken-8-ball-bi-monthly-tournament-2',
    'tekken-8-ball-round-robin'
);
