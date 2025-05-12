import React, { useState } from 'react';

import Navbar from '../Components/Navbar';
import UserCreateForm from "./Users";

const UserListPage = () => {
  const [users, setUsers] = useState([
    {
      _id: '1',
      username: 'john_doe',
      fullname: 'John Doe',
      organization: 'Acme Corp',
      role: 'admin',
      lastActive: new Date().toISOString(),
    },
    {
      _id: '2',
      username: 'jane_smith',
      fullname: 'Jane Smith',
      organization: 'Globex Inc',
      role: 'user',
      lastActive: new Date().toISOString(),
    },
    {
      _id: '3',
      username: 'michael99',
      fullname: 'Michael Johnson',
      organization: 'Initech',
      role: 'auditor',
      lastActive: new Date().toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const handleNewUser = () => {
    setShowSidebar(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    document.body.style.overflow = 'auto';
  };

  const filteredUsers = users.filter(user =>
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.organization || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h1 className="text-2xl font-semibold text-gray-700">User List</h1>
            <div className="flex gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name, username, or organization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              <button
                onClick={handleNewUser}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-1"
              >
                <span>+</span>
                <span>New User</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.organization}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.lastActive).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="mt-2">No users found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleCloseSidebar}
          />
          <div 
            className={`absolute right-0 top-0 h-full bg-white w-full sm:w-[600px] shadow-xl transform transition-all duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[calc(100%-64px)] overflow-y-auto">
              <UserCreateForm onClose={handleCloseSidebar} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserListPage;
