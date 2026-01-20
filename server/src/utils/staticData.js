import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE_PATH = path.join(__dirname, "../../../client/src/components/Events/events.js");

let cachedEvents = null;

export const getStaticEvents = () => {
    // Disable caching for dev/debug to ensure file changes are picked up
    // if (cachedEvents) return cachedEvents;

    try {
        if (!fs.existsSync(EVENTS_FILE_PATH)) {

            console.warn(`[StaticData] Warning: ${EVENTS_FILE_PATH} not found.`);
            return [];
        }

        const fileContent = fs.readFileSync(EVENTS_FILE_PATH, "utf-8");
        const startIdx = fileContent.indexOf("[");
        const endIdx = fileContent.lastIndexOf("]");

        if (startIdx === -1 || endIdx === -1) {
            console.error("[StaticData] Could not find array in events.js");
            return [];
        }

        const arrayStr = fileContent.substring(startIdx, endIdx + 1);

        // Use Function constructor to safely evaluate the array string
        // This is necessary because events.js is likely ES module and contains objects
        const events = new Function(`return ${arrayStr}`)();
        cachedEvents = events;
        return events;
    } catch (error) {
        console.error(`[StaticData] Error parsing events.js: ${error.message}`);
        return [];
    }
};

export const getStaticEvent = (idOrSlug) => {
    const events = getStaticEvents();
    const idStr = idOrSlug?.toString();
    return events.find(e =>
        e.slug === idStr ||
        e.id?.toString() === idStr ||
        e._id?.toString() === idStr
    );
};
