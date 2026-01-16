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

export const clubsData = [
    {
        id: 1,
        slug: 'melodia',
        name: 'Melodia',
        illustration: melodiaIllustration,
        tagline: 'Music & Performance Club',
        color: '#dc2626',
        events: [
            {
                id: 'solo-singing',
                themeName: 'Voice of Void',
                realName: 'Solo Singing',
                type: 'Solo',
                description: 'Unleash your inner melody and captivate the audience with your vocal prowess. A stage set for the purest voices to echo through the silence.',
                fee: 'Rs. 150',
                teamSize: '1',
                slotsAvailable: 20,
                rounds: '2',
                date: 'Feb 15, 10:00 AM',
                venue: 'Main Auditorium',
                rules: [
                    'Time limit: 3-4 minutes.',
                    'track must be submitted 1 hour prior.',
                    'No backing vocals allowed in the track.',
                    'Judges decision is final.'
                ],
                contacts: [
                    { name: 'John Doe', phone: '9876543210' },
                    { name: 'Jane Smith', phone: '9123456780' }
                ]
            },
            {
                id: 'band-battle',
                themeName: 'Symphony of War',
                realName: 'Battle of Bands',
                type: 'Team',
                description: 'The ultimate showdown of rhythm, riffs, and roars. Assemble your crew and reign supreme.',
                fee: 'Rs. 800',
                teamSize: '4-6',
                slotsAvailable: 8,
                rounds: '1',
                date: 'Feb 15, 6:00 PM',
                venue: 'Open Air Theatre',
                rules: [
                    'Time limit: 15 minutes including setup.',
                    'Drum kit will be provided.',
                    'Original compositions get extra points.'
                ],
                contacts: [
                    { name: 'Mike Ross', phone: '8888888888' }
                ]
            }
        ],
    },
    {
        id: 2,
        slug: 'cdc',
        name: 'CDC',
        tagline: 'Social Impact Initiative',
        illustration: cdcIllustartion,
        event: 'Social Impact Summit',
        date: 'February 18, 2026',
        time: '10:00 AM',
        venue: 'Conference Hall A',
        description: 'Workshop on community service initiatives and sustainable development goals.',
        color: '#16a34a',
        events: [
            {
                id: 'social-ent',
                themeName: 'Change Makers',
                realName: 'Social Entrepreneurship',
                type: 'Team',
                description: 'Pitch your innovative social business idea that solves real-world problems.',
                fee: 'Rs. 300',
                teamSize: '2-4',
                slotsAvailable: 15,
                rounds: '2',
                date: 'Feb 18, 11:00 AM',
                venue: 'Conference Hall A',
                rules: [
                    'Presentation limit: 10 mins.',
                    'Prototype/Business Model Canvas required.',
                    'Focus on sustainability and impact.'
                ],
                contacts: [
                    { name: 'Sarah Lee', phone: '7777777777' }
                ]
            }
        ],
    },
    {
        id: 3,
        slug: 'wec',
        name: 'WEC',
        tagline: 'Leadership & Equality',
        illustration: wecIllustartion,
        event: 'Empower Her 2026',
        date: 'February 20, 2026',
        time: '2:00 PM',
        venue: 'Seminar Hall',
        description: 'Panel discussion on women leadership and gender equality.',
        color: '#9333ea',
        events: [
            {
                id: 'leadership-talk',
                themeName: 'Queen\'s Gambit',
                realName: 'Leadership Talk',
                type: 'Solo',
                description: 'Deliver an inspiring speech on empowerment and leadership in the modern era.',
                fee: 'Free',
                teamSize: '1',
                slotsAvailable: 30,
                rounds: '1',
                date: 'Feb 20, 2:30 PM',
                venue: 'Seminar Hall',
                rules: [
                    'Speech duration: 5 mins.',
                    'Topic will be given on the spot.'
                ],
                contacts: [
                    { name: 'Emily Clark', phone: '6666666666' }
                ]
            }
        ],
    },
    {
        id: 4,
        slug: 'dance',
        name: 'Dance',
        tagline: 'Rhythm & Movement',
        illustration: danceIllustration,
        event: 'Rhythm Revolution',
        date: 'February 22, 2026',
        time: '5:00 PM',
        venue: 'Open Air Theatre',
        description: 'Inter-college dance competition featuring multiple styles.',
        color: '#ea580c',
        events: [
            {
                id: 'solo-dance',
                themeName: 'Celestial Cypher : Western',
                realName: 'Solo Dance-Showdown',
                type: 'Solo',
                description: 'Dance is a superpower within us all, but only a few dare to unleash its magic. From energetic thumkas to graceful footwork, every move mesmerizes and tells a story. When fueled by passion, dance captivates, bringing the stage to life. We can\'t wait to experience this enchantment!',
                fee: 'Rs. 200',
                teamSize: '1',
                slotsAvailable: 50,
                rounds: '2',
                date: '3rd April, 10:45 am',
                venue: 'Auditorium & Portico',
                rules: [
                    'Tracks to be submitted in Pen Drives (in mp3 format strictly) to the event coordinators in ready to play condition.',
                    'Classical routines are not allowed.',
                    'Dance on western songs and fusion can also be performed under this same category.',
                    'Stage cleanliness and discipline should be maintained.',
                    'Participants must report on the mentioned time. Not doing so will lead to disqualification.'
                ],
                roundDetails: [
                    {
                        title: 'Screening',
                        details: [
                            'Time limit: 1-2mins',
                            'The elimination round will be held in a closed room.'
                        ]
                    },
                    {
                        title: 'Final Battle',
                        details: [
                            'This is the on-the-spot battle(face-off) round.',
                            'Participants will be given an initial time limit of 25-30 sec to show their best dance moves on stage to randomly played music.',
                            'The decision of the judges will be final and binding.'
                        ]
                    }
                ],
                contacts: [
                    { name: 'Dance Coord 1', phone: '9988776655' },
                    { name: 'Dance Coord 2', phone: '1122334455' }
                ]
            },
            {
                id: 'group-dance',
                themeName: 'Synchro Squad',
                realName: 'Group Dance',
                type: 'Team',
                description: 'Synchronize your moves and set the stage on fire with your crew.',
                fee: 'Rs. 500',
                teamSize: '4-8',
                slotsAvailable: 10,
                rounds: '1',
                date: '3rd April, 2:00 PM',
                venue: 'Open Air Theatre',
                rules: [
                    'Time limit: 6-8 minutes.',
                    'Props are allowed but must be cleared by the team.',
                    'Theme selection is open.'
                ],
                contacts: [
                    { name: 'Group Lead', phone: '5544332211' }
                ]
            }
        ],
    },
    {
        id: 5,
        slug: 'hr',
        name: 'HR',
        tagline: 'Talent & Strategy',
        illustration: hrillustartion,
        event: 'Talent Acquisition',
        date: 'February 26, 2026',
        time: '11:00 AM',
        venue: 'Business Lab',
        description: 'Corporate recruitment strategies with industry experts.',
        color: '#0891b2',
        events: [
            {
                id: 'hr-case',
                themeName: 'The Boardroom',
                realName: 'HR Case Study',
                type: 'Team',
                description: 'Solve complex HR dilemmas and present your strategic solutions to the board.',
                fee: 'Rs. 250',
                teamSize: '3-4',
                slotsAvailable: 12,
                rounds: '2',
                date: 'Feb 26, 11:00 AM',
                venue: 'Business Lab',
                rules: [
                    'Case will be provided on the spot.',
                    'Preparation time: 1 hour.',
                    'Formal attire mandatory.'
                ],
                contacts: [
                    { name: 'HR Head', phone: '9900990099' }
                ]
            }
        ],
    },
    {
        id: 6,
        slug: 'media',
        name: 'Media',
        tagline: 'Lens & Vision',
        illustration: mediaIllustartion,
        event: 'Lens & Light',
        date: 'February 27, 2026',
        time: '9:00 AM',
        venue: 'Art Gallery',
        description: 'Student photography showcase with various perspectives.',
        color: '#ca8a04',
        events: [
            {
                id: 'photography-solo',
                themeName: 'Shutter Island',
                realName: 'Photography',
                type: 'Solo',
                description: 'Capture the essence of the moment. A picture is worth a thousand words.',
                fee: 'Rs. 100',
                teamSize: '1',
                slotsAvailable: 40,
                rounds: '1',
                date: 'Feb 27, 9:00 AM',
                venue: 'Campus Wide',
                rules: [
                    'DSLR and Mobile photography allowed categories.',
                    'No heavy editing/manipulation.',
                    'Raw files may be requested.'
                ],
                contacts: [
                    { name: 'Lens Master', phone: '8877665544' }
                ]
            }
        ],
    },
    {
        id: 7,
        slug: 'literary',
        name: 'Literary',
        tagline: 'Words & Wisdom',
        illustration: literaryIllustration,
        event: 'WordSmith Highlights',
        date: 'February 28, 2026',
        time: '3:00 PM',
        venue: 'Library',
        description: 'Poetry slam and creative writing competition.',
        color: '#7c3aed',
        events: [
            {
                id: 'debate',
                themeName: 'War of Words',
                realName: 'Debate',
                type: 'Team',
                description: 'Engage in a battle of logic, rhetoric, and wit.',
                fee: 'Rs. 150',
                teamSize: '2',
                slotsAvailable: 16,
                rounds: '3',
                date: 'February 28, 3:00 PM',
                venue: 'Library Auditorium',
                rules: [
                    'Topic given 24 hours prior.',
                    'Rebuttal rounds included.',
                    'No personal attacks.'
                ],
                contacts: [
                    { name: 'Word Smith', phone: '7766554433' }
                ]
            }
        ],
    },
    {
        id: 8,
        slug: 'specials',
        name: 'Specials',
        tagline: 'Innovation & Code',
        event: 'CodeBreaker',
        illustration: specialsIllustration,
        date: 'March 3, 2026',
        time: '24 Hours',
        venue: 'Labs',
        description: '24-hour coding challenge.',
        color: '#0284c7',
        events: [
            {
                id: 'hackathon',
                themeName: 'Hack The Future',
                realName: 'Hackathon',
                type: 'Team',
                description: 'Build the future in 24 hours. Code, Coffee, Conquer.',
                fee: 'Rs. 1000',
                teamSize: '4',
                slotsAvailable: 25,
                rounds: '1',
                date: 'March 3, 9:00 AM',
                venue: 'Computer Lab Complex',
                rules: [
                    'Bring your own laptops.',
                    'Internet provided.',
                    'Any stack allowed.'
                ],
                contacts: [
                    { name: 'Tech Lead', phone: '9911991199' }
                ]
            }
        ],
    },
    {
        id: 9,
        slug: 'sports',
        name: 'Sports',
        tagline: 'Athletics & Team Spirit',
        illustration: sportsIllustartion,
        event: 'Champions League',
        date: 'March 5-7, 2026',
        time: 'Varies',
        venue: 'Sports Complex',
        description: 'Inter-college sports tournaments.',
        color: '#16a34a',
        events: [
            {
                id: 'football',
                themeName: 'Goal Diggers',
                realName: 'Football Tournament',
                type: 'Team',
                description: 'Showcase your football skills and lead your team to victory.',
                fee: 'Rs. 1500',
                teamSize: '11',
                slotsAvailable: 8,
                rounds: 'Knockout',
                date: 'March 5, 9:00 AM',
                venue: 'Main Football Ground',
                rules: [
                    'FIFA rules apply.',
                    'Team jersey mandatory.',
                    'Substitutions allowed as per standard rules.'
                ],
                contacts: [
                    { name: 'Coach Carter', phone: '6655443322' }
                ]
            }
        ],
    },
    {
        id: 10,
        slug: 'fine-arts',
        name: 'Fine Arts',
        tagline: 'Creativity & Expression',
        illustration: fineartsIllustration,
        event: 'Canvas Carnival',
        date: 'March 10, 2026',
        time: '10:00 AM',
        venue: 'Art Studio',
        description: 'Art competition showcasing various mediums and styles.',
        color: '#db2777',
        events: [
            {
                id: 'Ramp-walk',
                themeName: 'VOGUE VOYAGE',
                realName: 'Fashion Show',
                type: 'Special',
                description: 'Strut your stuff and showcase the latest trends on the runway.',
                fee: 'Rs. 300',
                teamSize: 'N/A',
                slotsAvailable: 20,
                rounds: '1',
                date: 'March 10, 10:00 AM',
                venue: 'Main Ramp',
                rules: [
                    'Participants must bring their own outfits.',
                    'Time limit: 5 minutes per walk.',
                    'Judges decision is final.'
                ],
                contacts: [
                    { name: 'Fashion Guru', phone: '5544667788' }
                ]
            }
        ],
    },
    {
        id: 11,
        slug: 'title-events',
        name: 'Title Events',
        tagline: 'Flagship Extravaganzas',
        event: 'The Grand Gala',
        illustration: titleEventsIllustration,
        date: 'March 15-17, 2026',
        time: 'Varies',
        venue: 'Main Auditorium & Grounds',
        description: 'The crown jewels of our event lineup, featuring star-studded performances and grand finales.',
        color: '#f59e0b',
        events: [
            {
                id: 'Mr-Ms-Invento',
                themeName: 'The Epitome',
                realName: 'Mr. & Ms. Invento',
                type: 'Solo',
                description: 'A prestigious pageant celebrating charisma, talent, and intellect.',
                fee: 'Rs. 500',
                teamSize: '1',
                slotsAvailable: 30,
                rounds: '3',
                date: 'March 15, 6:00 PM',
                venue: 'Main Auditorium',
                rules: [
                    'Multiple rounds including talent, Q&A, and ramp walk.',
                    'Formal and casual wear segments included.',
                    'Judges decision is final and binding.'
                ],
                contacts: [
                    { name: 'Pageant Coordinator', phone: '4433221100' }
                ]
            }
        ]
    },
    {
        id: 12,
        slug: 'Fashion',
        name: 'Fashion',
        tagline: 'Style & Glamour',
        illustration: fashionIllustration,
        event: 'Style Saga',
        date: 'March 12, 2026',
        time: '4:00 PM',
        venue: 'Main Ramp',
        description: 'Fashion show highlighting contemporary trends and designs.',
        color: '#db2777',
        events: [
            {
                id: 'Ramp-walk',
                themeName: 'VOGUE VOYAGE',
                realName: 'Fashion Show',
                type: 'Special',
                description: 'Strut your stuff and showcase the latest trends on the runway.',
                fee: 'Rs. 300',
                teamSize: 'N/A',
                slotsAvailable: 20,
                rounds: '1',
                date: 'March 10, 10:00 AM',
                venue: 'Main Ramp',
                rules: [
                    'Participants must bring their own outfits.',
                    'Time limit: 5 minutes per walk.',
                    'Judges decision is final.'
                ],
                contacts: [
                    { name: 'Fashion Guru', phone: '5544667788' }
                ]
            }
        ]
    },
    {
        id: 13,
        slug: 'Gaming',
        name: 'Gaming',
        tagline: 'Virtual Battles & E-Sports',
        illustration: gamingIllustration,
        event: 'E-Sports Championship',
        date: 'March 20-22, 2026',
        time: 'Varies',
        venue: 'Gaming Arena',
        description: 'Competitive gaming tournaments across popular titles.',
        color: '#10b981',
        events: [
            {
                id: 'cs-go-tournament',
                themeName: 'Counter-Strike Showdown',
                realName: 'CS:GO Tournament',
                type: 'Team',
                description: 'Assemble your squad and dominate the battlefield in this high-stakes CS:GO tournament.',
                fee: 'Rs. 1200',
                teamSize: '5',
                slotsAvailable: 16,
                rounds: 'Knockout',
                date: 'March 20, 10:00 AM',
                venue: 'Gaming Arena',
                rules: [
                    'Standard CS:GO competitive rules apply.',
                    'Bring your own peripherals.',
                    'Match format: Best of 3.'
                ],
                contacts: [
                    { name: 'Gaming Head', phone: '3344556677' }
                ]
            }
        ],
    }
]
