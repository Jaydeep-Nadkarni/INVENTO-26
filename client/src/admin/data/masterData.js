export const masterStats = {
    totalParticipants: 1284,
    totalEvents: 27,
    totalAdmins: 14,
    totalRevenue: "₹1,45,200",
    systemHealth: "Optimal",
    activeNodes: 8
};

export const adminDistribution = [
    { team: "Dance", admins: 3, participants: 148 },
    { team: "Music", admins: 2, participants: 112 },
    { team: "Coding", admins: 4, participants: 245 },
    { team: "Gaming", admins: 3, participants: 412 },
    { team: "Art", admins: 2, participants: 367 },
];

export const globalRecentActivity = [
    { id: 1, action: "Master Override", user: "SuperAdmin", target: "System Config", time: "5 mins ago" },
    { id: 2, action: "Admin Assigned", user: "Admin-04", target: "Coding Team", time: "25 mins ago" },
    { id: 3, action: "Batch Verification", user: "Auto-System", target: "Music Team", time: "1 hour ago" },
    { id: 4, action: "Security Alert", user: "Node-Beta", target: "Firewall", time: "3 hours ago" },
];

export const adminsList = [
    { id: "ADM-001", name: "Ananya Sharma", email: "dance@invento.com", role: "Dance", status: "Active" },
    { id: "ADM-002", name: "Vikram Rathore", email: "music@invento.com", role: "Music", status: "Active" },
    { id: "ADM-003", name: "Siddharth Malviya", email: "coding@invento.com", role: "Coding", status: "Active" },
    { id: "ADM-004", name: "Priya Das", email: "gaming@invento.com", role: "Gaming", status: "Offline" },
    { id: "ADM-005", name: "Rahul Verma", email: "art@invento.com", role: "Art", status: "Active" },
];

export const eventsList = [
    { id: "EVT-01", name: "Beat The Heat", team: "Dance", participants: 45, status: "Live" },
    { id: "EVT-02", name: "Staccato", team: "Music", participants: 32, status: "Upcoming" },
    { id: "EVT-03", name: "Logic Hack", team: "Coding", participants: 120, status: "Live" },
    { id: "EVT-04", name: "Valorant Master", team: "Gaming", participants: 64, status: "Live" },
    { id: "EVT-05", name: "Canvas 1.0", team: "Art", participants: 28, status: "Completed" },
    { id: "EVT-06", name: "Group Groove", team: "Dance", participants: 103, status: "Upcoming" },
];

export const allParticipants = [
    { id: "INV-26-1001", name: "Amit Kumar", team: "Dance", event: "Hip Hop Solo", status: "Verified" },
    { id: "INV-26-1002", name: "Neha Sharma", team: "Coding", event: "Logic Hack", status: "Registered" },
    { id: "INV-26-1003", name: "Sahil Singh", team: "Music", event: "Staccato", status: "Verified" },
    { id: "INV-26-1004", name: "Anjali Gupta", team: "Gaming", event: "Valorant Master", status: "Verified" },
    { id: "INV-26-1005", name: "Kunal Verma", team: "Art", event: "Canvas 1.0", status: "Verified" },
    { id: "INV-26-1006", name: "Rahul Dravid", team: "Dance", event: "Beat The Heat", status: "Registered" },
    { id: "INV-26-1007", name: "Suresh Raina", team: "Coding", event: "Logic Hack", status: "Verified" },
    { id: "INV-26-1008", name: "Hardik Pandya", team: "Music", event: "Staccato", status: "Verified" },
];

export const masterActivityLogs = [
    { id: 1, admin: "Dance Secretary", action: "Marked Present", event: "Hip Hop Solo", time: "10:42 AM", team: "Dance" },
    { id: 2, admin: "Music Head", action: "Updated Score", event: "Staccato", time: "11:15 AM", team: "Music" },
    { id: 3, admin: "Tech Lead", action: "Added Participant", event: "Logic Hack", time: "11:30 AM", team: "Coding" },
    { id: 4, admin: "Art Coordinator", action: "Finalized Results", event: "Canvas 1.0", time: "12:05 PM", team: "Art" },
    { id: 5, admin: "Gaming Admin", action: "Disqualified Player", event: "Valorant Master", time: "01:20 PM", team: "Gaming" },
];
