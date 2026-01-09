import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Event from "../models/eventModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const clubsData = [
    {
        name: 'Melodia',
        events: [
            { id: 'solo-singing', name: 'Solo Singing', type: 'solo', fee: 150, min: 1, max: 1 },
            { id: 'band-battle', name: 'Battle of Bands', type: 'team', fee: 800, min: 4, max: 6 }
        ]
    },
    {
        name: 'CDC',
        events: [
            { id: 'social-ent', name: 'Social Entrepreneurship', type: 'team', fee: 300, min: 2, max: 4 }
        ]
    },
    {
        name: 'WEC',
        events: [
            { id: 'leadership-talk', name: 'Leadership Talk', type: 'solo', fee: 0, min: 1, max: 1 }
        ]
    },
    {
        name: 'Dance',
        events: [
            { id: 'solo-dance', name: 'Solo Dance-Showdown', type: 'solo', fee: 200, min: 1, max: 1 },
            { id: 'group-dance', name: 'Group Dance', type: 'team', fee: 500, min: 4, max: 8 }
        ]
    },
    {
        name: 'HR',
        events: [
            { id: 'hr-case', name: 'HR Case Study', type: 'team', fee: 250, min: 3, max: 4 }
        ]
    },
    {
        name: 'Media',
        events: [
            { id: 'photography-solo', name: 'Photography', type: 'solo', fee: 100, min: 1, max: 1 }
        ]
    },
    {
        name: 'Literary',
        events: [
            { id: 'debate', name: 'Debate', type: 'team', fee: 150, min: 2, max: 2 }
        ]
    },
    {
        name: 'Specials',
        events: [
            { id: 'hackathon', name: 'Hackathon', type: 'team', fee: 1000, min: 4, max: 4 }
        ]
    }
];

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing events
        await Event.deleteMany({});
        console.log("Cleared existing events.");

        const eventDocs = [];
        clubsData.forEach(club => {
            club.events.forEach(event => {
                eventDocs.push({
                    _id: event.id,
                    name: event.name,
                    type: event.type,
                    club: [club.name],
                    price: event.fee,
                    minTeamSize: event.min,
                    maxTeamSize: event.max,
                    participants: [],
                    teams: []
                });
            });
        });

        await Event.insertMany(eventDocs);
        console.log(`Successfully seeded ${eventDocs.length} events.`);
        
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedEvents();
