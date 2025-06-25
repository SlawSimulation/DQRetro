require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

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
                variables: {
                    slug: eventSlug
                },
            })
        });

        const data = await res.json();

        if (data.errors) {
            console.error("GraphQL error:", data.errors);
            return null;
        }

        if (!data.data || !data.data.event) {
            console.error("No event found for slug:", eventSlug);
            return null;
        }

        console.log(data.data);
        return data.data.event.id;

    } catch (err) {
        console.error("Request failed:", err);
        return null;
    }
};

// Usage:
(async () => {
    const eventId = await getEventId(
        'dq-retro-tekken-8-ball-bi-monthly-tournament-3-online',
        'tekken-8-ball-double-elimination'
    );
    console.log("Event ID:", eventId);
})();
