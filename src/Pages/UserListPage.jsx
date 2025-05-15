import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import UserCreateForm from "./Users";
import axios from 'axios';
import { Eye, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';
import { Filter, Building2 } from 'lucide-react'; // Optional icons

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mfaEnabled:false

  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [organizationFilter, setOrganizationFilter] = useState('all');
  const [organizationsList, setOrganizationsList] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user/get', {
        withCredentials: true
      });
      const activeUsers = response.data.users.filter(user => user.isActive !== undefined);
      setUsers(activeUsers);

      // Extract unique organizations for filter dropdown
      const orgs = new Set();
      activeUsers.forEach(user => {
        if (user.organizations) {
          user.organizations.forEach(org => {
            orgs.add(org.organization);
          });
        }
      });
      setOrganizationsList(['all', ...Array.from(orgs).sort()]);
    } catch (err) {
      alert("Failed to fetch users");
    }
  };

  const handleView = async (user) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user/getbyId/${user._id}`, {
        withCredentials: true,
      });
      setSelectedUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user details:", err);
      alert("Failed to view user details");
    }
  };

  const handleUpdate = (user) => {
    setUserToUpdate(user);
    setUpdateFormData({
      username: user.username || '',
      password: user.password || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      mfaEnabled: user.mfaEnabled || false
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!userToUpdate) return;

    try {
      const response = await axios.put(
        `http://localhost:3001/api/user/update/${userToUpdate._id}`,
        updateFormData,
        { withCredentials: true }
      );

      alert(response.data.message);
      fetchUsers();
      setUserToUpdate(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleUserStatus = async (user) => {
    const userId = user._id;
    const action = user.isActive ? 'deactivate' : 'activate';
    // const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);
    // if (!confirmAction) return;

    try {
      if (user.isActive) {
        await axios.delete(`http://localhost:3001/api/user/delete/${userId}`, {
          withCredentials: true,
        });
      } else {
        await axios.patch(`http://localhost:3001/api/user/activate/${userId}`, {}, {
          withCredentials: true,
        });
      }

      // alert(`User ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const handleNewUser = () => {
    setShowSidebar(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    document.body.style.overflow = 'auto';
  };

  const filteredUsers = users.filter(user => {
    // Apply status filter
    if (statusFilter === 'active' && !user.isActive) return false;
    if (statusFilter === 'inactive' && user.isActive) return false;

    // Apply organization filter
    if (organizationFilter !== 'all' &&
      (!user.organizations || !user.organizations.some(org => org.organization === organizationFilter))) {
      return false;
    }

    // Apply search term filter
    return (
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.organizations || []).some(org => org.organization.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h1 className="text-3xl font-bold text-indigo-600">User List</h1>
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

          {/* Filter controls */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="statusFilter" className="text-lg font-bold  text-gray-700">Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="organizationFilter" className="text-lg font-bold text-gray-700">Organization:</label>
              <select
                id="organizationFilter"
                value={organizationFilter}
                onChange={(e) => setOrganizationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {organizationsList.map(org => (
                  <option key={org} value={org}>
                    {org === 'all' ? 'All Organizations' : org}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">MFA Enable</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Active status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.organizations?.map(org => org.organization).join(', ') || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mfaEnabled ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3 flex items-center">
                        {/* View Button with Eye Icon */}
                        <button
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          onClick={() => handleView(user)}
                        >
                          <Eye size={20} />
                        </button>

                        {/* Edit Button with Pencil Icon */}
                        <button
                          className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                          onClick={() => handleUpdate(user)}
                        >
                          <Pencil size={20} />
                        </button>

                        {/* Toggle Switch for Activate/Deactivate */}
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className="focus:outline-none"
                        >
                          {user.isActive ? (
                            <ToggleRight size={32} className="text-green-500" />
                          ) : (
                            <ToggleLeft size={32} className="text-red-500" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="mt-2">No users found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

       {selectedUser && (
  <>
    {/* Overlay backdrop */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
      onClick={() => setSelectedUser(null)} // close on backdrop click
    />

    {/* Modal container */}
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6 animate-fadeIn">
        <h2
          id="modal-title"
          className="text-2xl font-bold text-indigo-700 mb-4"
        >
          User Details
        </h2>

        <div id="modal-description" className="space-y-2 text-gray-700">
          <p><strong>Username:</strong> {selectedUser.username}</p>
          <p><strong>First Name:</strong> {selectedUser.firstName}</p>
          <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone:</strong> {selectedUser.phone}</p>

          <div>
            <strong>Organizations:</strong>
            <ul className="list-disc list-inside ml-4">
              {selectedUser.organizations?.length > 0 ? (
                selectedUser.organizations.map((org) => (
                  <li key={org._id}>{org.organization}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
            
          </div>

          <p><strong>MFA Enabled:</strong> {selectedUser.mfaEnabled ? 'Yes' : 'No'}</p>
          <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
          
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="mt-6 inline-flex justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>

    {/* Optional keyframes for fadeIn animation */}
    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.25s ease forwards;
      }
    `}</style>
  </>
)}


        {userToUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Update User</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={updateFormData.username}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    name="password"
                    value={updateFormData.password}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={updateFormData.firstName}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={updateFormData.lastName}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={updateFormData.email}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={updateFormData.phone}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label>
                    <input
                      type="checkbox"
                      name="mfaEnabled"
                      checked={updateFormData.mfaEnabled}
                      onChange={handleUpdateChange}
                    />
                    Enable MFA
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setUserToUpdate(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSidebar && (
          <div className="fixed inset-0 z-50 transition-all duration-300 opacity-100 visible">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-100"
              onClick={handleCloseSidebar}
            />
            <div
              className="absolute right-0 top-0 h-full bg-white w-full sm:w-[600px] shadow-xl transform transition-all duration-300 ease-in-out translate-x-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-[calc(100%-64px)] overflow-y-auto">
                <UserCreateForm onClose={handleCloseSidebar} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserListPage;