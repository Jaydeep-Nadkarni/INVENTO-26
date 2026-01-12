import mongoose from "mongoose";
import Event from "./src/models/eventModel.js";
import dotenv from "dotenv";

dotenv.config();

// Define the critical data source (matching frontend exactly)
const eventsData = [
    // Melodia
    {
        id: 'solo-singing',
        name: 'Solo Singing',
        type: 'solo',
        price: 150,
        minTeamSize: 1,
        maxTeamSize: 1,
        whatsappLink: 'https://chat.whatsapp.com/sample'
    },
    {
        id: 'band-battle',
        name: 'Battle of Bands',
        type: 'team',
        price: 800,
        minTeamSize: 4,
        maxTeamSize: 6
    },
    // CDC
    {
        id: 'social-ent',
        name: 'Social Entrepreneurship',
        type: 'team',
        price: 300,
        minTeamSize: 2,
        maxTeamSize: 4
    },
    // WEC
    {
        id: 'leadership-talk',
        name: 'Leadership Talk',
        type: 'solo',
        price: 0,
        minTeamSize: 1,
        maxTeamSize: 1
    },
    // Dance
    {
        id: 'solo-dance',
        name: 'Solo Dance-Showdown',
        type: 'solo',
        price: 200,
        minTeamSize: 1,
        maxTeamSize: 1,
        whatsappLink: 'https://chat.whatsapp.com/dance'
    },
    {
        id: 'group-dance',
        name: 'Group Dance',
        type: 'team',
        price: 500,
        minTeamSize: 4,
        maxTeamSize: 8
    },
    // HR
    {
        id: 'hr-case',
        name: 'HR Case Study',
        type: 'team',
        price: 250,
        minTeamSize: 3,
        maxTeamSize: 4
    },
    // Media
    {
        id: 'photography-solo',
        name: 'Photography',
        type: 'solo',
        price: 100,
        minTeamSize: 1,
        maxTeamSize: 1
    },
    // Literary
    {
        id: 'debate',
        name: 'Debate',
        type: 'team',
        price: 150,
        minTeamSize: 2,
        maxTeamSize: 2
    },
    // Specials/Hackathon
    {
        id: 'hackathon',
        name: 'Hackathon',
        type: 'team',
        price: 1000,
        minTeamSize: 4,
        maxTeamSize: 4
    }
];

const syncEvents = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    try {
        for (const evt of eventsData) {
            // Upsert by 'id' primarily, or 'name' if id is missing in DB
            // We use findOneAndUpdate with upsert: true
            // But uniqueness is on 'id'.

            await Event.findOneAndUpdate(
                { id: evt.id },
                {
                    $set: {
                        id: evt.id,
                        name: evt.name,
                        type: evt.type,
                        price: evt.price,
                        minTeamSize: evt.minTeamSize,
                        maxTeamSize: evt.maxTeamSize,
                        whatsappLink: evt.whatsappLink || ''
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Synced: ${evt.name} (${evt.id})`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

syncEvents();
