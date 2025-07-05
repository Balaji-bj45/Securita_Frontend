import React, { useState } from 'react';
import Navbar from '../Components/Navbar';

const organizations = [
  { id: 1, name: 'Org One' },
  { id: 2, name: 'Org Two' },
];

const mockData = {
  1: {
    groups: ['Dev Team', 'QA Team'],
    users: ['Alice', 'Bob'],
  },
  2: {
    groups: ['Designers', 'Managers'],
    users: ['Charlie', 'David'],
  },
};

const Connections = () => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('RDP');

  const handleAssign = (user) => {
    alert(`${user} assigned to ${selectedProtocol} on ${selectedOrg}`);
  };

  return (
    <>
   
      <Navbar />
 <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Remote Connections</h1>

        {/* Organization Selector */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Select Organization:</label>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        {/* If organization is selected */}
        {selectedOrg && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Groups Panel */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">User Groups</h2>
              <ul className="space-y-2">
                {mockData[selectedOrg].groups.map((group, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md shadow-sm">
                    <span>{group}</span>
                    <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add Group</button>
            </div>

            {/* Users Panel */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Users</h2>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Assign Protocol</label>
                <select
                  value={selectedProtocol}
                  onChange={(e) => setSelectedProtocol(e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border rounded-md"
                >
                  <option value="RDP">RDP</option>
                  <option value="APP">APP</option>
                  <option value="SSH">SSH</option>
                </select>
              </div>
              <ul className="space-y-3">
                {mockData[selectedOrg].users.map((user, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md shadow-sm">
                    <span>{user}</span>
                    <button
                      onClick={() => handleAssign(user)}
                      className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Assign to {selectedProtocol}
                    </button>
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add User</button>
            </div>
          </div>
        )}
      </div>
    </div>
    
</>
  );
};

export default Connections;
