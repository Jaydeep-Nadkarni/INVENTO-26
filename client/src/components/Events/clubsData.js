import melodiaIllustration from '../../assets/UI/Events/melodia.png'
import danceIllustration from '../../assets/UI/Events/dance.png'
import mediaIllustartion from '../../assets/UI/Events/media.png'
import hrillustartion from '../../assets/UI/Events/hr.png'
import literaryIllustration from '../../assets/UI/Events/literary.png'
import cdcIllustartion from '../../assets/UI/Events/cdc.png'
import wecIllustartion from '../../assets/UI/Events/wec.png'
import sportsIllustartion from '../../assets/UI/Events/sports.png'
import fineartsIllustration from '../../assets/UI/Events/finearts.png'
import titleEventsIllustration from '../../assets/UI/Events/title-events.png'
import fashionIllustration from '../../assets/UI/Events/fashion.png'
import specialsIllustration from '../../assets/UI/Events/specials.png'
import gamingIllustration from '../../assets/UI/Events/gaming.png'
import eventsData from './events.js'

// Helper to map DB event to frontend format used in Event Cards/Details
export const mapEventFromDb = (event) => ({
    id: (event._id || event.id || "").toString(),

    themeName: event.name || event.title,
    realName: event.subtitle,
    type: event.eventType || event.type,
    description: event.description,
    fee: (event.price ?? event.registartionfee) === 0 ? 'FREE' : `Rs. ${event.price ?? event.registartionfee}`,
    teamSize: (() => {
        const min = event.minTeamSize ?? event.team?.min ?? 1;
        const max = event.maxTeamSize ?? event.team?.max ?? 1;
        return min === max ? `${max}` : `${min}-${max}`;
    })(),


    slotsAvailable: event.slots?.availableSlots ?? event.slots?.available ?? 'TBD',
    rounds: (event.rounds || "").toString(),
    date: event.logistics?.date || event.date || 'TBD',
    venue: event.logistics?.venue || event.venue || 'TBD',

    rules: event.rules || [],
    whatsapplink: event.whatsapplink || "",
    roundDetails: (event.rounddetails || []).map(r => ({
        title: `Round ${r.round}`,
        details: [r.description]
    })),
    contacts: (event.contact || []).filter(c => c && c.name).map(c => ({
        name: c.name,
        phone: c.phone
    }))
});

const getEventsByClub = (clubName) => {
    return eventsData
        .filter(event => (event.club || "").toLowerCase() === clubName.toLowerCase())
        .map(mapEventFromDb);
}


export const clubsData = [
    {
        id: 1,
        slug: 'melodia',
        name: 'Melodia',
        illustration: melodiaIllustration,
        tagline: 'Music & Performance Club',
        color: '#dc2626',
        events: getEventsByClub('Melodia'),
    },
    {
        id: 2,
        slug: 'cdc',
        name: 'CDC',
        tagline: 'Social Impact Initiative',
        illustration: cdcIllustartion,
        color: '#16a34a',
        events: getEventsByClub('CDC'),
    },
    {
        id: 3,
        slug: 'wec',
        name: 'WEC',
        tagline: 'Leadership & Equality',
        illustration: wecIllustartion,
        color: '#9333ea',
        events: getEventsByClub('WEC'),
    },
    {
        id: 4,
        slug: 'dance',
        name: 'Dance',
        tagline: 'Rhythm & Movement',
        illustration: danceIllustration,
        color: '#ea580c',
        events: getEventsByClub('Dance'),
    },
    {
        id: 5,
        slug: 'media',
        name: 'Media',
        tagline: 'Journalism & Content',
        illustration: mediaIllustartion,
        color: '#2563eb',
        events: getEventsByClub('Media'),
    },
    {
        id: 6,
        slug: 'hr',
        name: 'HR',
        tagline: 'Management & People',
        illustration: hrillustartion,
        color: '#db2777',
        events: getEventsByClub('HR'),
    },
    {
        id: 7,
        slug: 'literary',
        name: 'Literary',
        tagline: 'Words & Beyond',
        illustration: literaryIllustration,
        color: '#059669',
        events: getEventsByClub('Literary'),
    },
    {
        id: 8,
        slug: 'sports',
        name: 'Sports',
        tagline: 'The Ultimate Playbook',
        illustration: sportsIllustartion,
        color: '#f59e0b',
        events: getEventsByClub('Sports'),
    },
    {
        id: 9,
        slug: 'fine-arts',
        name: 'Fine Arts',
        tagline: 'Artistic Excellence',
        illustration: fineartsIllustration,
        color: '#7c3aed',
        events: getEventsByClub('Fine Arts'),
    },
    {
        id: 10,
        slug: 'title-events',
        name: 'Title Events',
        tagline: 'The Signature Showdowns',
        illustration: titleEventsIllustration,
        color: '#b91c1c',
        events: getEventsByClub('Title Events'),
    },
    {
        id: 11,
        slug: 'fashion',
        name: 'Fashion',
        tagline: 'Style & Elegance',
        illustration: fashionIllustration,
        color: '#be185d',
        events: getEventsByClub('Fashion'),
    },
    {
        id: 12,
        slug: 'specials',
        name: 'Specials',
        tagline: 'Something Different',
        illustration: specialsIllustration,
        color: '#4b5563',
        events: getEventsByClub('Specials'),
    },
    {
        id: 13,
        slug: 'gaming',
        name: 'Gaming',
        tagline: 'Digital Frontiers',
        illustration: gamingIllustration,
        color: '#111827',
        events: getEventsByClub('Gaming'),
    }
]
