const eventsData = [
    {
        id: 1,
        slug: "solo-singing-eastern",
        title: "RAGA Undercover",
        subtitle: "Solo Singing (Eastern)",
        description: "A solo singing competition focused on Eastern music styles. Participants perform individually and are judged on vocal precision, emotional depth, and stage presence.",
        club: "Melodia",
        tier: "Silver",
        type: "Solo",
        registartionfee: 200,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "3+1 mins – Only vocals, no background music"
            },
            {
                round: 2,
                description: "4+2 mins – Karaoke or maximum one accompaniment"
            }
        ],
        venue: "Saptarishi Hall",
        date: "Day 0",
        time: "10:00 AM",
        rules: [
            "Karaoke tracks must be submitted in Pen Drives (mp3 format strictly) in ready-to-play condition",
            "The judge’s decision will be final and binding",
            "Stage discipline and decorum must be maintained",
            "Late arrival may lead to disqualification"
        ],
        contact: [
            { name: "Rutu Deshanur", phone: "8073367828" },
            { name: "Vachan Deshnoor", phone: "9108753697" },
            { name: "Divesh Harikant", phone: "9535953089" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 2,
        slug: "solo-singing-western",
        title: "SpyTone",
        subtitle: "Solo Singing (Western)",
        description: "A western solo singing event where participants showcase versatility, clarity, and stage presence through vocal-only and karaoke-based performances.",
        club: "Melodia",
        tier: "Silver",
        type: "Solo",
        registartionfee: 200,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "3+1 mins – Only vocals"
            },
            {
                round: 2,
                description: "4+2 mins – Karaoke or maximum one accompaniment"
            }
        ],
        venue: "Saptarishi Hall",
        date: "26-02-2026",
        time: "01:00 PM",
        rules: [
            "No growling and no vulgarity allowed",
            "Karaoke tracks must be submitted in Pen Drives (mp3 format strictly)",
            "The judge’s decision will be final",
            "Participants must strictly adhere to time limits"
        ],
        contact: [
            { name: "Rutu Deshanur", phone: "8073367828" },
            { name: "Vachan Deshnoor", phone: "9108753697" },
            { name: "Divesh Harikant", phone: "9535953089" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 3,
        slug: "group-singing-battle-of-bands",
        title: "SYMPHONICA",
        subtitle: "Group Singing / Battle of Bands",
        description: "A group singing and instrumental battle where teams perform together, focusing on harmony, coordination, and musical intelligence.",
        club: "Melodia",
        tier: "Gold",
        type: "Team",
        registartionfee: 600,
        team: {
            min: 4,
            max: 8
        },
        teampercollege: 2,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "8+4 mins (including setup time)"
            }
        ],
        venue: "Apple Garden",
        date: "27-02-2026",
        time: "05:00 PM",
        rules: [
            "This is a completely instrumental-based event",
            "Drums are strictly not allowed",
            "Other percussion instruments are permitted",
            "No growling and no vulgarity allowed",
            "The judge’s decision will be final"
        ],
        contact: [
            { name: "Anish Kulkarni", phone: "7349726138" },
            { name: "Maithili Joshi", phone: "8971619354" },
            { name: "Divesh", phone: "9535953089" },
            { name: "Sumedh", phone: "8217542153" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 4,
        slug: "percussion",
        title: "Beat Protocol",
        subtitle: "Percussion (Solo)",
        description: "A solo percussion event where participants command rhythm and tempo using percussion instruments. Performances are judged on accuracy, control, and stage discipline.",
        club: "Melodia",
        tier: "Silver",
        type: "Solo",
        registartionfee: 100,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "3+1 mins – Only percussion instruments allowed"
            }
        ],
        venue: "Portico (Backstage)",
        date: "27-02-2026",
        time: "10:00 AM",
        rules: [
            "Only percussion instruments are allowed",
            "The judge’s decision will be final",
            "Participants must maintain stage discipline"
        ],
        contact:[
            { name: "Anish Kulkarni", phone: "7349726138" },
            { name: "Maithili Joshi", phone: "8971619354" },
            { name: "Divesh", phone: "9535953089" },
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 5,
        slug: "non-percussion",
        title: "Operation Harmonics",
        subtitle: "Non-Percussion (Solo Instrumental)",
        description: "A solo instrumental event focusing on melody and expression without percussion instruments. Participants perform using strings, keys, or wind instruments.",
        club: "Melodia",
        tier: "Silver",
        type: "Solo",
        registartionfee: 100,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "3+1 mins – Percussion instruments strictly not allowed"
            }
        ],
        venue: "Portico (Backstage)",
        date: "27-02-2026",
        time: "12:00 PM",
        rules: [
            "Percussion instruments are strictly not allowed",
            "Judge’s decision will be final",
            "Participants must maintain decorum and follow coordinator instructions"
        ],
        contact: [
            { name: "Anish Kulkarni", phone: "7349726138" },
            { name: "Maithili Joshi", phone: "8971619354" },
            { name: "Divesh", phone: "9535953089" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 6,
        slug: "the-spy-saga",
        title: "THE SPY SAGA",
        subtitle: "Multi-Round Spy Strategy Challenge",
        description: "A multi-stage spy-themed challenge designed to test physical agility, logical reasoning, observation, and teamwork. Teams progress through three high-intensity missions where time, discipline, and strategy decide survival.",
        club: "CDC",
        tier: "Gold",
        type: "Team",
        registartionfee: 500,
        team: {
            min: 4,
            max: 4
        },
        teampercollege: null,
        slots: {
            open: {
                total: 80,
                available: 80
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 3,
        rounddetails: [
            {
                round: 1,
                description: "OPERATION: TRIPLE LOCK (Day 0) — Combined physical and logical challenge involving three sequential security levels. Timing: 10:00 AM"
            },
            {
                round: 2,
                description: "OPERATION: CROSSFIRE PROTOCOL (Day 1) — Counter-intelligence strategy mission with opposing teams and logical reasoning. Timing: 10:00 AM"
            },
            {
                round: 3,
                description: "OPERATION: RESCUE THE HOSTAGE! — Logic and observation based rescue mission in a sealed environment. Timing: 01:00 PM"
            }
        ],
        venue: "Mechanical Department",
        date: "Day 0 & Day 1",
        time: "10:00 AM",
        rules: [
            "This is a combined physical and logical challenge; strength, strategy, and teamwork are essential",
            "Fair play is mandatory; cheating or misconduct will result in immediate disqualification",
            "Teams must complete missions in sequence; skipping rounds is strictly prohibited",
            "External assistance or communication is strictly prohibited",
            "Damaging props, locks, venues, or equipment is not allowed",
            "Time limits will be strictly enforced for each mission",
            "Teams must rely only on intel and clues provided at the location",
            "All participants must maintain discipline, coordination, and decorum",
            "The decisions of the organizing committee and mission controllers are final and binding"
        ],
        contact: [
            {
                name: "Sanjana Biradar",
                contact: "9886037411"
            },
            {
                name: "Shreyas Jamkandi",
                contact: "6362630705"
            },
            {
                name: "Bhumika Nagarali",
                contact: "8618512318"
            },
            {
                name: "Madhura Patil",
                contact: "8618019165"
            }

        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 7,
        slug: "ground-zero-act",
        title: "GROUND ZERO ACT",
        subtitle: "Nukkad Natak (Street Play)",
        description: "A Spy-Verse inspired comic performance competition where teams act as undercover agents using humor, satire, and exaggerated comic situations to decode everyday scenarios. The event focuses purely on comedy, comic timing, live energy, and audience engagement.",
        club: "WEC",
        tier: "Silver",
        type: "Team",
        registartionfee: 300,
        team: {
            min: 6,
            max: 12
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: true,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "THE COMIC FILES (Day 1) — Live comic street performance based on the theme Undercover Comedy. Performance duration: 8–10 minutes."
            }
        ],
        venue: "To Be Announced",
        date: "Day 1",
        time: "To Be Announced",
        rules: [
            "The performance must maintain a clear comic and humorous tone throughout",
            "Vulgarity, offensive language, political or religious references are strictly prohibited",
            "Use of microphones, recorded background music, or sound systems is not allowed",
            "Only simple, hand-held props are permitted",
            "No damage to the performance area or disturbance to the audience is allowed",
            "Teams must report 30 minutes prior to their allotted performance time",
            "Any form of indiscipline or misconduct will result in immediate disqualification",
            "The decision of the judges and organizing committee will be final and binding"
        ],
        contact: [
            { name: "Ananya Pattar", phone: "9353367220" },
            { name: "Prapti", phone: "7483148635" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 8,
        slug: "mission-masked",
        title: "MISSION: MASKED",
        subtitle: "Special Effects Makeup",
        description: "A special effects makeup competition focused on transformation, creativity, and hidden identity. The theme is revealed on the spot, testing adaptability, originality, and visual storytelling skills.",
        club: "WEC",
        tier: "Gold",
        type: "Team",
        registartionfee: 200,
        team: {
            min: 1,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Single Round — On-the-spot theme based special effects makeup challenge. Makeup duration: 1 hour 30 mins. Presentation: 1 minute explanation to judges."
            }
        ],
        venue: "Studio 1 and 2",
        date: "Day 0",
        time: "1 hour 30 mins",
        rules: [
            "Participants must report to the venue on time",
            "The theme announced on the spot must be strictly followed",
            "Teams must complete their makeup within the given time limit",
            "Participants must bring their own makeup and special effects materials",
            "The model’s face/body should be clean and free of makeup before the start",
            "Teams must maintain discipline and cleanliness at the workspace",
            "Any form of malpractice will lead to disqualification",
            "The judges’ decision will be final and binding"
        ],
        contact: [
            { name: "Shraddha Shahapurkar", phone: "7204955278" },
            { name: "Roopashree Pote", phone: "8904376126" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 9,
        slug: "solo-dance-western",
        title: "ONE // UNKNOWN",
        subtitle: "Solo Dance (Western)",
        description: "A western solo dance event where participants perform as undercover agents, using rhythm, precision, and expressive movement to reveal hidden identities through dance.",
        club: "Dance",
        tier: "Silver",
        type: "Solo",
        registartionfee: 200,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "Screening (Elimination) — Day 0, 10:45 AM, 1–2 mins, closed room (Auditorium)"
            },
            {
                round: 2,
                description: "Final Battle — Day 0, 5:00 PM, 25–30 sec on randomly played music (Basketball Ground)"
            }
        ],
        venue: "Auditorium / Basketball Ground",
        date: "Day 0",
        time: "10:45 AM & 5:00 PM",
        rules: [
            "Tracks must be submitted in Pen Drives (mp3 format strictly) in ready-to-play condition",
            "Classical routines are not allowed; fusion is allowed",
            "Stage cleanliness and discipline must be maintained",
            "Participants must report on time; late arrival leads to disqualification"
        ],
        contact: [
            { name: "Maithili Joshi", phone: "8971619354" },
            { name: "Anish Kulkarni", phone: "7349726138" },
            { name: "Vachan Deshnoor", phone: "9108753697" },
            { name: "Rutu Deshanur", phone: "8073367828" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 10,
        slug: "duet-dance",
        title: "2v2 Agent Mode",
        subtitle: "Duet Dance",
        description: "A duet dance competition where two performers synchronize their movements to portray undercover chemistry through rhythm, storytelling, and coordinated execution.",
        club: "Dance",
        tier: "Silver",
        type: "Team",
        registartionfee: 300,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "Screening (Day 0) — 2–3 mins, elimination in closed room (Auditorium), 1:45 PM"
            },
            {
                round: 2,
                description: "Prop Round (Day 1) — 3–5 mins, mandatory prop provided, includes sequence from elimination round (Amphi Stage), 1:45 PM"
            }
        ],
        venue: "Auditorium / Amphi Stage",
        date: "Day 0 & Day 1",
        time: "1:45 PM",
        rules: [
            "Tracks must be submitted in Pen Drives (mp3 format strictly) in ready-to-play condition",
            "Classical routines are not allowed; fusion is allowed",
            "No extra marks for props beyond the Prop Round",
            "Stage cleanliness and discipline must be maintained",
            "Participants must report on time; late arrival leads to disqualification"
        ],
        contact: [
            { name: "Maithili Joshi", phone: "8971619354" },
            { name: "Anish Kulkarni", phone: "7349726138" },
            { name: "Vachan Deshnoor", phone: "9108753697" },
            { name: "Rutu Deshanur", phone: "8073367828" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 11,
        slug: "solo-dance-classical",
        title: "Antradhwani",
        subtitle: "Solo Dance (Classical)",
        description: "A classical solo dance competition where performers interpret hidden stories and elegance through traditional movements and classical music.",
        club: "Dance",
        tier: "Silver",
        type: "Solo",
        registartionfee: 200,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Single Round — Day 1, 10:45 AM, 3–5 mins performance (Amphi Stage)"
            }
        ],
        venue: "Amphi Stage",
        date: "Day 1",
        time: "10:45 AM",
        rules: [
            "Tracks must be submitted in Pen Drives (mp3 format strictly) in ready-to-play condition",
            "Only classical routines and classical music are allowed",
            "Stage cleanliness and discipline must be maintained",
            "Participants must report on time; late arrival leads to disqualification"
        ],
        contact: [
            { name: "Maithili Joshi", phone: "8971619354" },
            { name: "Anish Kulkarni", phone: "7349726138" },
            { name: "Vachan Deshnoor", phone: "9108753697" },
            { name: "Rutu Deshanur", phone: "8073367828" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 12,
        slug: "group-dance",
        title: "THE // AGENCY",
        subtitle: "Group Dance",
        description: "A high-energy group dance competition where teams execute synchronized performances showcasing coordination, strategy, and powerful stage presence.",
        club: "Dance",
        tier: "Gold",
        type: "Team",
        registartionfee: 500,
        team: {
            min: 8,
            max: 12
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Single Round — Day 1, 5:00 PM, 5–7 mins including stage setup (Main Stage)"
            }
        ],
        venue: "Main Stage",
        date: "Day 1",
        time: "5:00 PM",
        rules: [
            "Tracks must be submitted in Pen Drives (mp3 format strictly) in ready-to-play condition",
            "Teams comprising participants from different colleges are disqualified",
            "A minimum of 6 dancers must always be present on stage",
            "Fusion is allowed; props are allowed if approved by coordinators",
            "Stage cleanliness and discipline must be maintained",
            "Participants must report on time; late arrival leads to disqualification"
        ],
        contact: [
            { name: "Maithili Joshi", phone: "8971619354" },
            { name: "Anish Kulkarni", phone: "7349726138" },
            { name: "Vachan Deshnoor", phone: "9108753697" },
            { name: "Rutu Deshanur", phone: "8073367828" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 13,
        slug: "declassified-mockpress",
        title: "DECLASSIFIED",
        subtitle: "Mockpress",
        description: "A high-intensity mock press event set in the Spy-Verse where participants face media interrogation under pressure. The event tests wit, presence, persuasion, quick thinking, and the ability to defend narratives when every question is designed to expose the truth.",
        club: "HR",
        tier: "Gold",
        type: "Solo",
        registartionfee: 0,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: 10,
                available: 10
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "OFF THE RECORD (Shipwreck) — Day 0, 11:00 AM, EEE Seminar Hall. Participants assume famous personalities in a survival scenario using logic, persuasion, and strategy. Top 8 advance."
            },
            {
                round: 2,
                description: "LEAKS AND LIES (Mock-Press) — Day 1, 1:30 PM, Auditorium. High-pressure media interrogation where participants defend their actions and decisions."
            }
        ],
        venue: "EEE Seminar Hall / Auditorium",
        date: "Day 0 & Day 1",
        time: "11:00 AM & 1:30 PM",
        rules: [
            "Participants must report to the venue 15 minutes before the stated commencement time",
            "Participants will pick a chit that determines their assigned character",
            "Use of abusive or unparliamentary words or slangs will lead to immediate disqualification",
            "Only the top 8 participants will move to the final round",
            "The decision of the judges and jury will be final and non disputable"
        ],
        contact: [
            {
                name: "Neil Rego",
                phone: "9731379082"
            },
            {
                name: "Jaydeep Nadkarni",
                phone: "9481740517"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 14,
        slug: "the-tenet-protocol-debate",
        title: "THE TENET PROTOCOL",
        subtitle: "Debate",
        description: "A high-intensity debate competition set in the Spy-Verse where arguments are treated as strategic weapons. Participants defend assigned positions under scrutiny, adapt under uncertainty, and counter opposing views with precision, clarity, and conviction.",
        club: "HR",
        tier: "Gold",
        type: "Team",
        registartionfee: 0,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: 20,
                available: 20
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "PROTOCOL I: INITIAL TRANSMISSION — Day 0, 10:30 AM, Civil Seminar Hall. Teams deliver their assigned stance one by one without interruption, focusing on clarity and conviction."
            },
            {
                round: 2,
                description: "PROTOCOL II: COUNTER-INTELLIGENCE — Day 1, 1:00 PM, Civil Seminar Hall. Live debate with direct engagement, rebuttals, and strategic counter-arguments."
            }
        ],
        venue: "Civil Seminar Hall",
        date: "Day 0 & Day 1",
        time: "10:30 AM & 1:00 PM",
        rules: [
            "Each team must consist of exactly two participants",
            "The debate competition will be conducted in two rounds",
            "Motions in both rounds will be given in an extempore format",
            "Teams will be assigned positions for or against the motion",
            "A short preparation time will be provided before speaking",
            "Both team members must speak during the debate",
            "Interruptions or cross talk are not allowed unless permitted by judges",
            "Use of offensive language or personal attacks will lead to disqualification",
            "Exceeding the allotted time may result in penalties",
            "The judges’ decision shall be final and binding"
        ],
        contact: [
            {
                name: "Aadya Kulkarni",
                phone: "8088244039"
            },
            {
                name: "Ananya Banahatti",
                phone: "6366136535"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 15,
        slug: "secrets-on-trial",
        title: "SECRETS ON TRIAL",
        subtitle: "Poetry, Storytelling & Social Deduction",
        description: "A multi-round Spy-Verse literary and social challenge filled with hidden clues, mind games, and sudden twists. Participants are tested on creativity, storytelling, observation, persuasion, and composure under pressure.",
        club: "Literary",
        tier: "Gold",
        type: "Solo",
        registartionfee: 0,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: 40,
                available: 40
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 3,
        rounddetails: [
            {
                round: 1,
                description: "CODED VERSES (Poetry) — Day 0, 11:00 AM, Biomedical Seminar Hall. Participants express hidden meanings, emotions, and ideas through poetry under time limits."
            },
            {
                round: 2,
                description: "UNTOLD FILES (Story Telling) — Day 1, 10:00 AM, Biomedical Seminar Hall. Continue a mysterious incomplete story with creativity, narrative flow, and imagination."
            },
            {
                round: 3,
                description: "MAFIA JUDGE — Day 1, 1:00 PM, Biomedical Seminar Hall. A social-deduction round testing observation, persuasion, deception, and survival instincts."
            }
        ],
        venue: "Biomedical Seminar Hall",
        date: "Day 0 & Day 1",
        time: "11:00 AM, 10:00 AM & 1:00 PM",
        rules: [
            "Participants must adhere strictly to time limits for each round",
            "Creativity, presence of mind, and clarity of expression are essential",
            "Participants must maintain decorum and discipline throughout the event",
            "Any form of misconduct or unfair means will lead to disqualification",
            "The decision of the judges and organizing committee will be final and binding"
        ],
        contact: [
            {
                name: "Musebkhan",
                phone: "8618708521"
            },
            {
                name: "Akshaya Goudar",
                phone: "9980477327"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 16,
        slug: "decode-the-unknown-quiz",
        title: "DECODE THE UNKNOWN",
        subtitle: "Quiz",
        description: "A Spy-Verse themed intelligence quiz where knowledge, pattern recognition, and quick thinking are the only weapons. Participants face elimination and rapid-fire rounds designed to test awareness, recall, and performance under pressure.",
        club: "Literary",
        tier: "Gold",
        type: "Team",
        registartionfee: 0,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: 40,
                available: 40
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "ELIMINATOR — Day 0, 11:45 AM, Auditorium. A broad quiz covering spy movies, literature, real espionage, pop culture, and TV series. Only the top 6 teams advance."
            },
            {
                round: 2,
                description: "RAPID FIRE — Day 0, 11:45 PM, Auditorium. High-speed round with 20 questions requiring instant recall. Sudden-death questions decide ties."
            }
        ],
        venue: "Auditorium",
        date: "Day 0",
        time: "11:45 AM & 11:45 PM",
        rules: [
            "Teams must consist of exactly two participants",
            "No discussions are allowed during the rapid-fire round",
            "Any form of unfair means will lead to immediate disqualification",
            "In case of a tie, sudden-death questions will be asked",
            "The decision of the judges and quiz masters will be final and binding"
        ],
        contact: [
            {
                name: "Musebkhan",
                phone: "8618708521"
            },
            {
                name: "Akshaya Goudar",
                phone: "9980477327"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 17,
        slug: "mission-unblockable-volleyball",
        title: "MISSION: UNBLOCKABLE",
        subtitle: "Volleyball",
        description: "A competitive volleyball event set in the Spy-Verse where coordination, reflexes, and tactical play are crucial. Teams must operate with precision and discipline to dominate rallies and secure victory.",
        club: "Sports",
        tier: "Gold",
        type: "Team",
        registartionfee: 0,
        team: {
            min: 6,
            max: 6
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Match Play — Standard volleyball format with rally scoring and on-court rotations."
            }
        ],
        venue: "To Be Announced",
        date: "To Be Announced",
        time: "To Be Announced",
        rules: [
            "Each team must have exactly 6 players on the court at all times",
            "A point is scored on every rally regardless of serving team",
            "Teams must rotate clockwise after winning a rally on opponent serve",
            "A maximum of three touches is allowed to return the ball",
            "The same player cannot touch the ball twice consecutively",
            "The ball is in-bounds if any part touches the boundary lines",
            "Players must not touch the net while the ball is in play",
            "Catching, holding, or carrying the ball is not allowed",
            "The server must stay behind the end line until contact",
            "Back-row players cannot jump and spike from in front of the attack line",
            "The ball must pass between the antennae to be considered legal",
            "Event organizers reserve the right to amend rules and make final decisions"
        ],
        contact: [
            { name: null, phone: null },
            { name: null, phone: null }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 18,
        slug: "7-aside-football",
        title: "7 aside Football ",
        subtitle: "Football",
        description: "A life-sized foosball-style team event where players are restricted to lateral movement, demanding coordination, timing, and teamwork to score goals and outmaneuver opponents.",
        club: "Sports",
        tier: "Silver",
        type: "Team",
        registartionfee: 0,
        team: {
            min: 6,
            max: 6
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Match Play — Human foosball format with center drops and continuous play."
            }
        ],
        venue: "To Be Announced",
        date: "To Be Announced",
        time: "To Be Announced",
        rules: [
            "Each player must remain attached to or holding their designated bar or pole",
            "Players may only move side-to-side during play",
            "Both hands must remain on the designated bar at all times",
            "Players attached to the same bar must move in sync",
            "The ball starts with a center drop similar to table foosball",
            "Hands may not be used to touch the ball; only feet are allowed",
            "Kicking the ball above wall or head height is considered a foul",
            "A goal is counted when the ball enters the net and play resets",
            "If the ball becomes unreachable, the referee restarts play with a drop",
            "Event organizers reserve the right to amend rules and make final decisions"
        ],
        contact: [
            { name: "Radhesh P", phone: "8431972321" },
            { name: "Sushant Patil", phone: "7411312464" }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 19,
        slug: "operation-equalizer-best-out-of-waste",
        title: "OPERATION EQUALIZER",
        subtitle: "Best Out of Waste",
        description: "A creative upcycling challenge where teams transform waste materials into meaningful artwork. Participants are tested on creativity, sustainability, adaptability, and concept clarity through surprise constraints and twists.",
        club: "Fine Arts",
        tier: "Silver",
        type: "Team",
        registartionfee: 0,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Single Round — 75–90 mins. On-the-spot theme. Waste-material kit provided. Includes hidden meaning explanation, midway constraint, and material swap option."
            }
        ],
        venue: "To Be Announced",
        date: "To Be Announced",
        time: "75–90 mins",
        rules: [
            "Artwork must convey a hidden meaning explained in 30 seconds",
            "A midway twist will be introduced and must be followed strictly",
            "One-time material exchange with organizers is allowed",
            "Artwork name must be decided before starting the build",
            "Eco-friendly or awareness-based concepts receive bonus points"
        ],
        contact: [
            { name: null, phone: null },
            { name: null, phone: null }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 20,
        slug: "artathon-multi-round-art",
        title: "ARTATHON",
        subtitle: "Multi-Round Art Event",
        description: "A two-round art challenge testing creativity, texture, coordination, and adaptability. Participants work under restrictions such as blind tools and non-communication to produce connected artworks.",
        club: "Fine Arts",
        tier: "Gold",
        type: "Team",
        registartionfee: 0,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: 15,
                available: 15
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "Blind Tools Challenge — No paint brushes allowed. Use cotton, tissues, sponges, fingers, toothpicks, cardboard edges, leaves, or natural textures. Focus on texture and creativity."
            },
            {
                round: 2,
                description: "Swap & Sync Challenge — Sheets swapped every 15 minutes. No communication allowed. Final artworks must be visually or conceptually connected."
            }
        ],
        venue: "To Be Announced",
        date: "To Be Announced",
        time: "As per round schedule",
        rules: [
            "Theme will be announced on the spot",
            "No digital devices or references are allowed",
            "Paint brushes are strictly prohibited in Round 1",
            "Sheets must be swapped every 15 minutes in Round 2",
            "No communication is allowed between team members in Round 2",
            "Final artworks must be connected conceptually or visually"
        ],
        contact: [
            { name: null, phone: null },
            { name: null, phone: null }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 21,
        slug: "sneaker-painting",
        title: "SNEAKER PAINTING",
        subtitle: "Concept & Sneaker Art",
        description: "A two-round creative event where teams design and paint sneakers based on an on-the-spot theme. Participants are judged on concept clarity, originality, and execution.",
        club: "Fine Arts",
        tier: "Gold",
        type: "Team",
        registartionfee: 0,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "Concept Sheet — Theme announced on the spot. Teams create a clear design concept that will act as the base for sneaker painting."
            },
            {
                round: 2,
                description: "Sneaker Painting — Plain sneakers provided. Final design must clearly reflect the Round 1 concept. Only permitted materials allowed."
            }
        ],
        venue: "To Be Announced",
        date: "To Be Announced",
        time: "As decided by organizers",
        rules: [
            "Theme will be announced on the spot",
            "Concept sheet must clearly represent the sneaker design",
            "Sneaker design must be based on the Round 1 concept",
            "Only permitted paints and materials are allowed",
            "Vulgar, offensive, copied designs or brand logos are strictly prohibited"
        ],
        contact: [
            { name: null, phone: null },
            { name: null, phone: null }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 22,
        slug: "mr-and-ms-invento",
        title: "MR. & MS. INVENTO",
        subtitle: "Ultimate Personality Title",
        description: "A platinum-tier Spy-Verse title event that tests intellect, confidence, adaptability, performance, leadership, and composure under pressure. Contestants face multiple unpredictable trials to prove they are the ultimate agents.",
        club: "Title Events",
        tier: "Platinum",
        type: "Solo",
        registartionfee: 0,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                male: {
                    total: 15,
                    available: 15
                },
                female: {
                    total: 15,
                    available: 15
                }
            },
            official: {
                male: {
                    total: null,
                    available: null
                },
                female: {
                    total: null,
                    available: null
                }
            }
        },
        isPricePerPerson: false,
        rounds: 3,
        rounddetails: [
            {
                round: 1,
                description: "OPERATION: BLACK MIRROR — Day 0, 1:00 PM, Mechanical Seminar Hall. Observation, deception, and thinking under scrutiny."
            },
            {
                round: 2,
                description: "OPERATION: SHADOW RUN — Day 1, 9:00 AM, Mechanical Seminar Hall. Agility, stage presence, and bold performance."
            },
            {
                round: 3,
                description: "OPERATION: FINAL BETRAYAL — Day 2, 9:00 AM, Auditorium. Leadership, personality, and composure under extreme pressure."
            }
        ],
        venue: "Mechanical Seminar Hall / Auditorium",
        date: "Day 0, Day 1 & Day 2",
        time: "1:00 PM, 9:00 AM",
        rules: [
            "Participants must report on time for all rounds",
            "Misconduct or indiscipline will lead to disqualification",
            "Judges’ and organizing committee’s decisions are final and binding",
            "Participants must maintain decorum and professionalism throughout the event"
        ],
        contact: [
            {
                name: "Shreyash Savant",
                phone: "7019864016"
            },
            {
                name: "Aryan Patil",
                phone: "8495940101"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: "",
        isGenderSpecific: true
    },
    {
        id: 23,
        slug: "mr-and-miss-fashion-invento",
        title: "MR. & MISS FASHION INVENTO",
        subtitle: "Crowned in Confidence",
        description: "A platinum-tier fashion and personality title event where contestants compete across traditional, talent, and glamour rounds to prove confidence, creativity, communication, and stage presence.",
        club: "Title Events",
        tier: "Platinum",
        type: "Solo",
        registartionfee: 250,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                male: {
                    total: null,
                    available: null
                },
                female: {
                    total: null,
                    available: null
                }
            },
            official: {
                male: {
                    total: null,
                    available: null
                },
                female: {
                    total: null,
                    available: null
                }
            }
        },
        isPricePerPerson: false,
        rounds: 3,
        rounddetails: [
            {
                round: 1,
                description: "TRADITIONAL RAMP WALK – ROOTED IN ELEGANCE. Day 0, 11:00 AM–1:00 PM, Mask Hall. Time limit: 90–150 seconds."
            },
            {
                round: 2,
                description: "TALENT ROUND – BEYOND THE LOOK. Day 0, 5:30 PM–6:30 PM, Auditorium. Time limit: 2 minutes."
            },
            {
                round: 3,
                description: "GLAM RAMP WALK WITH Q&A – THE FINAL STATEMENT. Day 1, 6:00 PM onwards, Main Stage. Time limit: 2 minutes."
            }
        ],
        venue: "Mask Hall / Auditorium / Main Stage",
        date: "Day 0 & Day 1",
        time: "11:00 AM–1:00 PM, 5:30 PM–6:30 PM, 6:00 PM onwards",
        rules: [
            "Participants are eliminated after each round",
            "Theme of the event is 'Crowned in Confidence'",
            "Participants must submit tracks on pen drives in advance",
            "Vulgarity or obscenity will lead to disqualification",
            "Use of fireworks, water, or party props is strictly prohibited",
            "Girls must wear pencil heels in applicable rounds",
            "Negative marking applies if time limits are exceeded",
            "Judges’ decision will be final and binding"
        ],
        contact: [
            {
                name: "Anchal",
                contact: "9742362891"
            },
            {
                name: "Sumeet Vernekar",
                contact: "7349736783"
            },
            {
                name: "Manali kolhapuri",
                contact: "8310325865"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: "",
        isGenderSpecific: true
    },
    {
        id: 24,
        slug: "the-asset-appraisal-best-physic",
        title: "THE ASSET APPRAISAL",
        subtitle: "Best Physic",
        description: "A physique evaluation title event focusing on discipline, fitness, and presentation. Participants are judged through qualification rounds based on physique, conditioning, and adherence to competition standards.",
        club: "Title Events",
        tier: "Gold",
        type: "Solo",
        registartionfee: 0,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Single Round — Physique evaluation with multiple qualification stages based on judging criteria."
            }
        ],
        venue: "To Be Announced",
        date: "To Be Announced",
        time: "To Be Announced",
        rules: [
            "Participants must wear proper bodybuilding shorts with adequate coverage",
            "No logos or brand promotions are allowed on attire",
            "Participants must carry original College ID for verification",
            "Use of anabolic steroids or banned substances is strictly prohibited",
            "Participants must bring their own body paint or tanning products",
            "Judges evaluate participants across qualification rounds",
            "Misconduct or failure to follow instructions leads to disqualification"
        ],
        contact: [
            { name: null, phone: null },
            { name: null, phone: null }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 25,
        slug: "duo-fashion-invento",
        title: "The Palace Entry Begins",
        subtitle: "DUO FASHION INVENTO",
        description: "A gold-tier duo fashion event where pairs walk the runway as royal counterparts. Confidence, unity, presence, and style define this majestic walk inspired by kings and queens.",
        club: "Fashion",
        tier: "Gold",
        type: "Team",
        registartionfee: 200,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Single Round — Day 0, 3:30 PM, Main Stage. Theme: MAHARAJA MAHARANI MAJESTY. Time limit: 90–150 seconds including setup and performance."
            }
        ],
        venue: "Main Stage",
        date: "Day 0",
        time: "3:30 PM",
        rules: [
            "Theme for the event is 'MAHARAJA MAHARANI MAJESTY'",
            "Participants must carry their tracks on a pen drive and submit them in advance",
            "Each duo must carry at least one prop",
            "Vulgarity or obscenity will lead to disqualification",
            "Use of fireworks, water, or party props is strictly prohibited",
            "Negative marking applies if participants exceed the time limit",
            "The decision of the judges will be final and binding"
        ],
        contact: [
            {
                name: "Shradha Patil",
                contact: "7618735299"
            },
            {
                name: "Amruta Gaitonde",
                contact: "9113596198"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 26,
        slug: "group-fashion-invento",
        title: "A Night of Secrets",
        subtitle: "GROUP FASHION INVENTO",
        description: "A platinum-tier group fashion event built around a murder-mystery theme. Teams present a narrative-driven runway performance where fashion, suspicion, and storytelling merge into a silent investigation.",
        club: "Fashion",
        tier: "Platinum",
        type: "Team",
        registartionfee: 500,
        team: {
            min: 9,
            max: 15
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 2,
        rounddetails: [
            {
                round: 1,
                description: "Elimination Round — Day 1, Mask Hall (Closed Doors). Teams must submit a storyline write-up matching the performance. Late submissions lead to disqualification."
            },
            {
                round: 2,
                description: "Final Round — Day 1, 5:00 PM onwards, Main Stage. Teams must perform the same act as the elimination round."
            }
        ],
        venue: "Mask Hall / Main Stage",
        date: "Day 1",
        time: "5:00 PM onwards",
        rules: [
            "Theme for the event is 'MURDER-MYSTERY'",
            "Teams must submit a storyline write-up matching the performance",
            "Participants must carry their tracks on a pen drive and submit them in advance",
            "Each team must carry at least one prop",
            "Vulgarity or obscenity will lead to disqualification",
            "Use of fireworks, water, or party props is strictly prohibited",
            "Negative marking applies if participants exceed the time limit",
            "The decision of the judges will be final and binding"
        ],
        contact: [
            {
                name: "Aditya Patil",
                contact: "9945563040"
            },
            {
                name: "Amruta Gaitonde",
                contact: "9113596198"
            },
            {
                name: "Shradha Patil",
                contact: "7618735299"
            },
            {
                name: "Prem Suryavanshi",
                contact: "8618424952"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 27,
        slug: "vanguard-x-valorant-showdown",
        title: "VANGUARD X",
        subtitle: "Valorant Showdown",
        description: "A high-intensity Valorant esports showdown where elite squads clash using strategy, coordination, and precision. Teams battle in competitive 5v5 matches to prove dominance in the Spy-Verse network.",
        club: "Gaming",
        tier: "Gold",
        type: "Team",
        registartionfee: 500,
        team: {
            min: 5,
            max: 5
        },
        teampercollege: null,
        slots: {
            open: {
                total: 80,
                available: 80
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Tournament Matches — 5v5 Valorant matches with map selection via voting. Fixtures announced after registration closes."
            }
        ],
        venue: "CS Department Labs",
        date: "Day 0 & Day 1",
        time: "9:00 AM",
        rules: [
            "Players must bring their own laptops and complete gaming setup",
            "No refunds or player replacements once registration is confirmed",
            "Each team must consist of exactly 5 players; no substitutes allowed",
            "All players must report 30 minutes early with valid college ID",
            "Matches are played in 5v5 format; maps decided by voting",
            "Misbehavior or physical misconduct leads to immediate disqualification",
            "Each team must assign a leader with a valid WhatsApp number",
            "Maximum two cross-college players allowed; they earn 0 GC points",
            "Only currently enrolled college students are allowed",
            "Any cheating leads to immediate removal; coordinator’s decision is final"
        ],
        contact: [
            {
                name: "Shreyas Jamkandi",
                contact: "6362630705"
            },
            {
                name: "Aniket Patil",
                contact: "8147484903"
            },
            {
                name: "Sanjana Biradar",
                contact: "9886037411"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

    {
        id: 28,
        slug: "battleground-exe-bgmi",
        title: "BATTLEGROUND.exe",
        subtitle: "BGMI",
        description: "A next-generation BGMI tournament featuring qualification and final matches across iconic maps. Teams compete for survival, kills, and dominance in a high-stakes multiplayer warzone.",
        club: "Gaming",
        tier: "Gold",
        type: "Team",
        registartionfee: 500,
        team: {
            min: 4,
            max: 4
        },
        teampercollege: null,
        slots: {
            open: {
                total: 80,
                available: 80
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 3,
        rounddetails: [
            {
                round: 1,
                description: "Qualification Match 1 — Erangel"
            },
            {
                round: 2,
                description: "Qualification Match 2 — Miramar"
            },
            {
                round: 3,
                description: "Final Match — Map decided by voting (Erangel / Miramar / Vikendi)"
            }
        ],
        venue: "MB 106, MB 107 & MB 108",
        date: "Day 0 & Day 1",
        time: "9:00 AM",
        rules: [
            "Only smartphones are allowed; earphones are mandatory",
            "No substitute players are allowed once the tournament begins",
            "Cheating, abusive language, or misconduct leads to disqualification",
            "Team with highest total points wins; ties resolved by highest kills",
            "Each team must appoint a leader with a valid WhatsApp number",
            "Maximum two cross-college players allowed (0 GC points)",
            "Only currently enrolled college students are eligible",
            "Any rule violation may lead to disqualification without refund",
            "Coordinator’s decision is final"
        ],
        contact: [
            {
                name: "Shreyas Jamkandi",
                contact: "6362630705"
            },
            {
                name: "Aniket Patil",
                contact: "8147484903"
            },
            {
                name: "Sanjana Biradar",
                contact: "9886037411"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 29,
        slug: "photography-silver",
        title: "PHOTOGRAPHY",
        subtitle: "On-the-Spot Theme",
        description: "A solo photography competition where participants capture compelling images based on an on-the-spot theme, judged on creativity, composition, and overall impact.",
        club: "Media",
        tier: "Silver",
        type: "Solo",
        registartionfee: null,
        team: {
            min: 1,
            max: 1
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Final Round — Participants submit two best photographs based on the on-the-spot theme."
            }
        ],
        venue: null,
        date: null,
        time: null,
        rules: [
            "The theme will be disclosed on the day of the event",
            "Photographs must be clicked strictly based on the given theme",
            "Photos must be in JPG or JPEG format only",
            "Minimal photo editing is permissible; altering the photograph is not allowed",
            "Participants must submit their best two photographs only",
            "In case of multiple submissions, only the first two photos submitted will be considered",
            "Any suspected altered photograph will be rejected",
            "The submitted photograph must be original work of the participant",
            "Photographs must not have been previously published in any media",
            "Submission must be done via Google Drive link shared on the WhatsApp group before deadline",
            "Judging criteria includes theme interpretation, composition, creativity, and overall impact",
            "Organizing Committee’s decision will be final"
        ],
        contact: [
            {
                name: "Goureesh Hiremath",
                contact: "9902434746"
            },
            {
                name: "Vedant Kangralkar",
                contact: "6363816784"
            },
            {
                name: "Akash Patil",
                contact: "7619482051"
            },
            {
                name: "Ganesh Tudvekar",
                contact: "9886811751"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 30,
        slug: "short-film-silver",
        title: "SHORT FILM",
        subtitle: "Short Film Competition",
        description: "A team-based short film competition where participants create impactful stories within a limited duration, judged on direction, acting, storytelling, and technical excellence.",
        club: "Media",
        tier: "Gold",
        type: "Team",
        registartionfee: null,
        team: {
            min: 1,
            max: 7
        },
        teampercollege: 1,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Final Round — Teams submit a short film based on the announced theme."
            }
        ],
        venue: null,
        date: null,
        time: null,
        rules: [
            "The theme will be released one week before the event on official social media handles",
            "The short film duration must be between 3 to 6 minutes including titles and credits",
            "Films must not have been previously published in any media",
            "Video format must be MP4 or AVI",
            "A short synopsis must be included with the submission",
            "Films in languages other than English must include English subtitles",
            "Submission must be done via Google Drive link shared on the WhatsApp group before deadline",
            "Judging criteria includes direction, acting, editing, cinematography, story, and audio",
            "The organizing committee’s decision will be final"
        ],
        contact: [
            {
                name: "Goureesh Hiremath",
                contact: "9902434746"
            },
            {
                name: "Vedant Kangralkar",
                contact: "6363816784"
            },
            {
                name: "Akash Patil",
                contact: "7619482051"
            },
            {
                name: "Ganesh Tudvekar",
                contact: "9886811751"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },
    {
        id: 31,
        slug: "reel-making-silver",
        title: "REEL MAKING",
        subtitle: "Short Reel Competition",
        description: "A creative reel-making competition where teams produce engaging short-form videos based on an on-the-spot theme, optimized for social media platforms.",
        club: "Media",
        tier: "Silver",
        type: "Team",
        registartionfee: null,
        team: {
            min: 2,
            max: 2
        },
        teampercollege: null,
        slots: {
            open: {
                total: null,
                available: null
            },
            official: {
                total: null,
                available: null
            }
        },
        isPricePerPerson: false,
        rounds: 1,
        rounddetails: [
            {
                round: 1,
                description: "Final Round — Teams submit a vertical reel based on the on-the-spot theme."
            }
        ],
        venue: null,
        date: null,
        time: null,
        rules: [
            "The theme will be released on the spot",
            "Reel duration must be between 15 to 60 seconds",
            "All footage and audio used must be original",
            "Only royalty-free music or owned content is allowed",
            "The reel must be in vertical format (9:16 aspect ratio)",
            "Content must be family-friendly with no explicit material",
            "Submission must be done via Google Drive link shared on the WhatsApp group before deadline",
            "Organizers reserve the right to modify rules if necessary"
        ],
        contact: [
            {
                name: "Goureesh Hiremath",
                contact: "9902434746"
            },
            {
                name: "Vedant Kangralkar",
                contact: "6363816784"
            },
            {
                name: "Akash Patil",
                contact: "7619482051"
            },
            {
                name: "Ganesh Tudvekar",
                contact: "9886811751"
            }
        ],
        resgitartions: [
            {
                pearticpants: [],
                teams: []
            }
        ],
        status: "Open",
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-15T10:00:00Z",
        whatsapplink: ""
    },

]

export default eventsData;
