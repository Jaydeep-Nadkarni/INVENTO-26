import { clubsData } from './clubsData';

// Helper to distribute club events across days roughly
const allClubEvents = [];
clubsData.forEach(club => {
    if (club.events) {
        club.events.forEach(event => {
            allClubEvents.push({
                ...event,
                clubName: club.name.toUpperCase(),
                clubSlug: club.slug,
                isClubEvent: true
            });
        });
    }
});

// Split club events for demo purposes
const day1Events = allClubEvents.slice(0, 5);
const day2Events = allClubEvents.slice(5, 12);
const day3Events = allClubEvents.slice(12);

export const scheduleData = [
    {
        dayId: 0,
        date: 'DEC 15',
        label: 'DAY 0',
        title: 'The Awakening',
        events: [
            {
                id: 'inauguration',
                themeName: 'GRAND OPENING',
                realName: 'Inauguration Ceremony',
                time: '9:00 AM',
                venue: 'Main Auditorium',
                type: 'General',
                description: 'The beginning of the legacy.',
                isClubEvent: false
            },
            {
                id: 'trophy-reveal',
                themeName: 'THE REVEAL',
                realName: 'Trophy Unveiling',
                time: '11:00 AM',
                venue: 'Central Plaza',
                type: 'General',
                description: 'Witness the glory.',
                isClubEvent: false
            },
            ...day1Events.map((e, i) => ({
                ...e,
                time: `${1 + i}:00 PM`
            })),
            {
                id: 'concert-1',
                themeName: 'EUPHORIA NIGHT',
                realName: 'DJ Snake (Opening Act)',
                time: '7:00 PM',
                venue: 'Open Air Theatre',
                type: 'Concert',
                description: 'Lost in the rhythm.',
                isClubEvent: false
            }
        ]
    },
    {
        dayId: 1,
        date: 'DEC 16',
        label: 'DAY 1',
        title: 'The Momentum',
        events: [
            ...day2Events.map((e, i) => ({
                ...e,
                time: `${9 + i}:00 ${i < 3 ? 'AM' : 'PM'}`
            })),
            {
                id: 'fashion-show',
                themeName: 'VOGUE VOYAGE',
                realName: 'Fashion Show',
                time: '6:00 PM',
                venue: 'Main Ramp',
                type: 'Special',
                isClubEvent: false
            },
            {
                id: 'concert-2',
                themeName: 'ROCK ON',
                realName: 'Local Train Live',
                time: '8:00 PM',
                venue: 'Open Air Theatre',
                type: 'Concert',
                isClubEvent: false
            }
        ]
    },
    {
        dayId: 2,
        date: 'DEC 17',
        label: 'DAY 2',
        title: 'The Finale',
        events: [
            ...day3Events.map((e, i) => ({
                ...e,
                time: `${9 + i}:30 ${i < 3 ? 'AM' : 'PM'}`
            })),
            {
                id: 'closing',
                themeName: 'THE CLOSURE',
                realName: 'Prize Distribution',
                time: '5:00 PM',
                venue: 'Main Auditorium',
                type: 'General',
                isClubEvent: false
            },
            {
                id: 'star-night',
                themeName: 'STAR NIGHT',
                realName: 'Arijit Singh Live',
                time: '8:00 PM',
                venue: 'Stadium Ground',
                type: 'Concert',
                isClubEvent: false
            }
        ]
    }
];
