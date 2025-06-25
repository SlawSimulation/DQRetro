require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const startggURL = "https://api.start.gg/gql/alpha";
const startggKey = process.env.STARTGG_KEY;

const getEventId = (tournamentName, eventName) => {
    const eventSlug = `tournament/${tournamentName}/event/${eventName}`;
    let eventId;

    fetch(startggURL, {
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
    })
    .then(res => res.json())
    .then(data => {
        if (data.errors) {
            console.error("GraphQL error:", data.errors);
            return;
        }
        console.log(data.data);
        eventId = data.data.event.id;
        console.log("Event ID:", eventId);
    })
    .catch(err => {
        console.error("Request failed:", err);
    });

    return eventId;
};

// Call it like this (outside the function)
getEventId(
    'dq-retro-tekken-8-ball-bi-monthly-tournament-3-online',
    'tekken-8-ball-double-elimination'
);
