export const teams = [
    { id: "T-01", name: "Dance", assigned_event_id: "EVT-01" },
    { id: "T-02", name: "Media", assigned_event_id: "EVT-03" },
    { id: "T-03", name: "Registration", assigned_event_id: null },
    { id: "T-04", name: "HR", assigned_event_id: "EVT-07" },
    { id: "T-05", name: "Music", assigned_event_id: "EVT-02" },
    { id: "T-06", name: "Coding", assigned_event_id: "EVT-04" },
    { id: "T-07", name: "Gaming", assigned_event_id: "EVT-06" },
    { id: "T-08", name: "Art", assigned_event_id: "EVT-08" },
];

export const eventsList = [
    { id: "EVT-01", name: "Beat The Heat", team: "Dance", total_slots: 50, reserved_slots: 45, status: "Live" },
    { id: "EVT-02", name: "Staccato", team: "Music", total_slots: 40, reserved_slots: 32, status: "Upcoming" },
    { id: "EVT-03", name: "Shutter Speed", team: "Media", total_slots: 30, reserved_slots: 15, status: "Live" },
    { id: "EVT-04", name: "Logic Hack", team: "Coding", total_slots: 150, reserved_slots: 120, status: "Live" },
    { id: "EVT-06", name: "Valorant Master", team: "Gaming", total_slots: 64, reserved_slots: 64, status: "Live" },
    { id: "EVT-07", name: "Pitch Perfect", team: "HR", total_slots: 30, reserved_slots: 12, status: "Upcoming" },
    { id: "EVT-08", name: "Canvas 1.0", team: "Art", total_slots: 50, reserved_slots: 28, status: "Completed" },
    { id: "EVT-09", name: "Group Groove", team: "Dance", total_slots: 120, reserved_slots: 103, status: "Upcoming" },
    { id: "EVT-10", name: "Cyber Sentinel", team: "Coding", total_slots: 80, reserved_slots: 45, status: "Upcoming" },
];

export const adminsList = [
    { id: "ADM-001", name: "Ananya Sharma", email: "dance@invento.com", team: "Dance", status: "Active" },
    { id: "ADM-002", name: "Vikram Rathore", email: "music@invento.com", team: "Music", status: "Active" },
    { id: "ADM-003", name: "Siddharth Malviya", email: "coding@invento.com", team: "Coding", status: "Active" },
    { id: "ADM-004", name: "Priya Das", email: "gaming@invento.com", team: "Gaming", status: "Disabled" },
    { id: "ADM-005", name: "Rahul Verma", email: "art@invento.com", team: "Art", status: "Active" },
    { id: "ADM-006", name: "Sneha Kapur", email: "media@invento.com", team: "Media", status: "Active" },
    { id: "ADM-007", name: "Arjun Reddy", email: "hr@invento.com", team: "HR", status: "Active" },
    { id: "ADM-008", name: "Megha Singh", email: "reg@invento.com", team: "Registration", status: "Active" },
];

const indianNames = ["Amit", "Neha", "Sahil", "Anjali", "Kunal", "Sneha", "Rohan", "Pooja", "Vikram", "Ishita", "Arjun", "Kavya", "Rahul", "Deepika", "Suresh", "Priya", "Hardik", "Manish", "Shweta", "Aditya"];
const surnames = ["Kumar", "Sharma", "Singh", "Gupta", "Verma", "Das", "Malviya", "Rathore", "Kapur", "Reddy", "Patel", "Iyer", "Khan", "Jain", "Mehta"];
const teamNames = ["Dance", "Music", "Media", "Coding", "Gaming", "HR", "Art"];

const generateParticipants = (count) => {
    const participants = [];
    for (let i = 1; i <= count; i++) {
        const name = indianNames[Math.floor(Math.random() * indianNames.length)];
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        const team = teamNames[Math.floor(Math.random() * teamNames.length)];
        const event = eventsList.find(e => e.team === team)?.name || "General Registration";
        
        participants.push({
            id: `INV-26-${1000 + i}`,
            name: `${name} ${surname}`,
            team: team,
            event: event,
            email: `${name.toLowerCase()}.${surname.toLowerCase()}${i}@gmail.com`,
            contact: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
            payment_status: Math.random() > 0.3 ? 'paid' : 'pending',
            payment_amount: 500,
            verified: Math.random() > 0.4,
            present: false
        });
    }
    return participants;
};

export const allParticipants = generateParticipants(120);

export const masterActivityLogs = [
    { id: 1, admin: "Dance Secretary", action: "Marked Present", event: "Hip Hop Solo", time: "10:42 AM", team: "Dance" },
    { id: 2, admin: "Music Head", action: "Updated Score", event: "Staccato", time: "11:15 AM", team: "Music" },
    { id: 3, admin: "Tech Lead", action: "Added Participant", event: "Logic Hack", time: "11:30 AM", team: "Coding" },
    { id: 4, admin: "Art Coordinator", action: "Finalized Results", event: "Canvas 1.0", time: "12:05 PM", team: "Art" },
    { id: 5, admin: "Gaming Admin", action: "Disqualified Player", event: "Valorant Master", time: "01:20 PM", team: "Gaming" },
];

export const globalRecentActivity = [
    { id: 1, action: "Master Override", user: "SuperAdmin", target: "System Config", time: "5 mins ago" },
    { id: 2, action: "Admin Assigned", user: "Admin-04", target: "Coding Team", time: "25 mins ago" },
    { id: 3, action: "Batch Verification", user: "Auto-System", target: "Music Team", time: "1 hour ago" },
    { id: 4, action: "Security Alert", user: "Node-Beta", target: "Firewall", time: "3 hours ago" },
];

// Computed Stats for UI consistency
export const masterStats = {
    totalParticipants: allParticipants.length,
    totalEvents: eventsList.length,
    totalAdmins: adminsList.length,
    totalRevenue: `₹${allParticipants.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + p.payment_amount, 0).toLocaleString()}`,
    systemHealth: "Optimal",
    activeNodes: 8
};

export const adminDistribution = ["Dance", "Music", "Media", "Coding", "Gaming", "HR", "Art"].map(team => ({
    team,
    admins: adminsList.filter(a => a.team === team).length,
    participants: allParticipants.filter(p => p.team === team).length
}));

// Helpers
export const getTeamEvents = (team) => eventsList.filter(e => e.team === team);
export const getTeamParticipants = (team) => allParticipants.filter(p => p.team === team);
export const totalRevenueCalc = () => allParticipants.filter(p => p.payment_status === 'paid').reduce((acc, p) => acc + p.payment_amount, 0);
export const clubOccupancy = (club) => {
    const clubEvents = eventsList.filter(e => e.team === club);
    if (clubEvents.length === 0) return 0;
    const totalSlots = clubEvents.reduce((acc, e) => acc + e.total_slots, 0);
    const reservedSlots = clubEvents.reduce((acc, e) => acc + e.reserved_slots, 0);
    return Math.round((reservedSlots / totalSlots) * 100);
};

const defaultData = {
    teams,
    events: eventsList,
    admins: adminsList,
    participants: allParticipants,
    masterStats,
    adminDistribution,
    masterActivityLogs,
    helpers: {
        getTeamEvents,
        getTeamParticipants,
        totalRevenue: totalRevenueCalc,
        clubOccupancy
    }
};

export default defaultData;
