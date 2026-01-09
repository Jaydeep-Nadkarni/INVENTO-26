import React from 'react';
import { useData } from '../../context/DataContext';
import { Users2, Search, Filter, MoreVertical, Plus } from 'lucide-react';

const MasterTeams = () => {
  const { participants, events } = useData();

  // Mock teams data for now - could be derived from participants in the future
  const teams = [
    { id: 'T-001', name: 'Cyber Sentinels', leader: 'Alice Johnson', event: 'Web Hackathon', status: 'Approved', members: 4 },
    { id: 'T-002', name: 'Digital Druids', leader: 'Bob Smith', event: 'UI/UX Design', status: 'Pending', members: 3 },
    { id: 'T-003', name: 'Neural Knights', leader: 'Charlie Brown', event: 'AI Challenge', status: 'Approved', members: 5 },
    { id: 'T-004', name: 'Pixel Pioneers', leader: 'Diana Prince', event: 'Game Dev', status: 'Verified', members: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Teams Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all participating teams across events.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams, leaders, or events..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Team ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Leader</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{team.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{team.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{team.leader}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">{team.event}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{team.members}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      team.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      team.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing {teams.length} teams</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-400" disabled>Previous</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterTeams;
