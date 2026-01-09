import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { Search, UserCheck, MoreVertical, Filter, Download } from 'lucide-react';

const AdminParticipants = () => {
    const { participants, updateParticipant } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const markPresent = (id) => {
        updateParticipant(id, { attendance: 'Present' });
    };

    const filteredParticipants = participants.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
    );

    return (
        <div className="flex h-screen bg-white text-gray-900 border-gray-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 lg:ml-64">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Participants Registry</h1>
                            <p className="text-sm text-gray-500">Manage attendee verification and attendance for your team's events</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm font-semibold rounded hover:bg-gray-50 text-gray-700">
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                    </header>

                    {/* Filters & Actions */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name, event, or ID..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-gray-200 rounded hover:bg-gray-50">
                                <Filter className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Data Table */}
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">ID</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Name</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Event</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Attendance</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredParticipants.map((participant) => (
                                    <tr key={participant.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-400">#{participant.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{participant.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{participant.event}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                participant.status === 'Verified' 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {participant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold ${
                                                participant.attendance === 'Present' ? 'text-green-600' : 'text-gray-400'
                                            }`}>
                                                {participant.attendance}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {participant.attendance !== 'Present' ? (
                                                <button 
                                                    onClick={() => markPresent(participant.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase rounded hover:bg-gray-800 transition-all"
                                                >
                                                    <UserCheck className="w-3 h-3" />
                                                    Check-in
                                                </button>
                                            ) : (
                                                <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">Confirmed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredParticipants.length === 0 && (
                            <div className="p-12 text-center text-gray-500 italic text-sm">
                                No participants found matching your criteria
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminParticipants;

export default AdminParticipants;
