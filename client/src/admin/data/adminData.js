export const adminStats = {
    team: "Dance",
    totalParticipants: 148,
    totalEvents: 6,
    activeEvents: 4,
    pendingVerifications: 12
};

export const participantsData = [
    { id: "INV-26-001", name: "Aryan Sharma", event: "Solo Dance", status: "Registered", attendance: "Absent" },
    { id: "INV-26-002", name: "Isha Patel", event: "Group Dance", status: "Verified", attendance: "Absent" },
    { id: "INV-26-003", name: "Rohan Gupta", event: "Solo Dance", status: "Verified", attendance: "Present" },
    { id: "INV-26-004", name: "Sneha Reddy", event: "Duet Dance", status: "Registered", attendance: "Absent" },
    { id: "INV-26-005", name: "Vikram Singh", event: "Group Dance", status: "Verified", attendance: "Present" },
];

export const eventAttendanceStats = [
    { event: "Solo Dance", total: 45, present: 32 },
    { event: "Group Dance", total: 80, present: 55 },
    { event: "Duet Dance", total: 23, present: 18 },
];

export const recentActivities = [
    { id: 1, action: "Verified Participant", user: "John Doe", time: "2 mins ago" },
    { id: 2, action: "Updated Event Schedule", user: "Solo Heat", time: "15 mins ago" },
    { id: 3, action: "New Registration", user: "Sarah Smith", time: "1 hour ago" },
];
