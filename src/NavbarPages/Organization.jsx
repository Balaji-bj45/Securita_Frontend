import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Plus, X, Search, Users, Shield, Activity, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../Components/Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const colorPalette = [
  { bg: 'bg-gradient-to-br from-pink-50 to-pink-50', border: 'border-pink-200' },
  { bg: 'bg-gradient-to-br from-blue-50 to-blue-50', border: 'border-blue-200' },
  { bg: 'bg-gradient-to-br from-green-50 to-green-50', border: 'border-green-200' },
  { bg: 'bg-gradient-to-br from-yellow-50 to-yellow-50', border: 'border-yellow-200' },
  { bg: 'bg-gradient-to-br from-purple-50 to-purple-50', border: 'border-purple-200' },
  { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-50', border: 'border-indigo-200' },
];

function Organization() {
  const [orgName, setOrgName] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [selectedOrgForAdmin, setSelectedOrgForAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    let result = orgs;

    if (searchTerm) {
      result = result.filter((org) =>
        org.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab === 'active') {
      result = result.filter(org => org.isActive);
    } else if (activeTab === 'inactive') {
      result = result.filter(org => !org.isActive);
    }

    setFilteredOrgs(result);
  }, [searchTerm, orgs, activeTab]);

  const fetchOrganizations = async () => {
    try {
      setIsFetching(true);
      const res = await axios.get('http://localhost:3001/api/user/organization', {
        withCredentials: true,
      });
      setOrgs(res.data.orgs);
    } catch (error) {
      toast.error('Failed to load organizations');
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const orgRes = await axios.post(
        'http://localhost:3001/api/user/create/organization',
        { organization: orgName },
        { withCredentials: true }
      );

      toast.success('Organization created successfully!');
      setOrgName('');
      setShowModal(false);
      await fetchOrganizations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating organization');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (orgId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/user/get/organization/${orgId}`, {
        withCredentials: true,
      });

      const { orgs, userCount, admins } = res.data;

      setSelectedOrg({
        _id: orgId,
        name: orgs.organization,
        userCount,
        admins,
        adminUsername: admins.length > 0
          ? admins.map(admin => admin.username).join(', ')
          : 'N/A',
        createdAt: new Date(orgs.createdAt).toLocaleDateString(),
        isActive: orgs.isActive
      });
    } catch (error) {
      toast.error('Error fetching organization details');
      console.error(error);
    }
  };

  const handleAddAdminClick = async (orgId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/user/get/organization/${orgId}`, {
        withCredentials: true,
      });

      const { users } = res.data;
      setUsers(users);
      setSelectedOrgForAdmin(orgId);
      setShowAddAdminModal(true);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const handleRemoveAdmin = async (organizationId, userId, username) => {
    if (window.confirm(`Are you sure you want to remove ${username} as admin?`)) {
      try {
        const res = await axios.post(
          'http://localhost:3001/api/user/remove/admin',
          {
            organizationId,
            userId,
          },
          { withCredentials: true }
        );

        toast.success(res.data.message || 'Admin removed successfully');
        handleViewClick(organizationId);
      } catch (error) {
        console.error('Error removing admin:', error);
        toast.error('Failed to remove admin');
      }
    }
  };

  const handleAssignAdmin = async (userId) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/user/create/admin",
        {
          organizationId: selectedOrgForAdmin,
          userId,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Admin assigned successfully");
      setShowAddAdminModal(false);
      if (selectedOrg) {
        handleViewClick(selectedOrg._id);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to assign admin");
    }
  };

  const toggleOrgStatus = async (orgId, currentStatus) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/user/organization/${orgId}/status`,
        { isActive: !currentStatus },
        { withCredentials: true }
      );
      toast.success(`Organization ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchOrganizations();
      if (selectedOrg && selectedOrg._id === orgId) {
        setSelectedOrg({ ...selectedOrg, isActive: !currentStatus });
      }
    } catch (error) {
      toast.error('Failed to update organization status');
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" toastOptions={{
        style: {
          marginTop: '3.5rem',
          borderRadius: '12px',
          padding: '16px',
          color: '#fff',
        },
        success: {
          style: {
            background: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
          },
        },
      }} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Organizations</h1>
              <p className="text-gray-600 mt-2">Manage all your organizations in one place</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              All Organizations
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('active')}
            >
              <Activity size={16} color='blue' /> Active
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'inactive' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('inactive')}
            >
              <X size={16} color='red' /> Inactive
            </button>
          </div>

          {/* Organization Grid */}
          {isFetching ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 rounded-xl border border-gray-200">
                  <Skeleton height={24} width="70%" />
                  <Skeleton height={16} width="50%" className="mt-4" />
                </div>
              ))}
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm ? 'Try a different search term' : 'Create your first organization to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} /> Create Organization
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Plus size={18} /> Create Organization
                </button>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredOrgs.map((org, i) => (
                  <motion.div
                    key={org._id}
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-xl border ${colorPalette[i % colorPalette.length].border} ${colorPalette[i % colorPalette.length].bg} shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}
                  >
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${org.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {org.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{org.organization}</h2>
                    <p className="text-sm text-gray-500 mb-4">Created: {new Date(org.createdAt).toLocaleDateString()}</p>

                    <div className="flex flex-wrap gap-2 mt-6">
                      <button
                        onClick={() => handleViewClick(org._id)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 font-medium text-sm group"
                      >
                        View details
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => handleAddAdminClick(org._id)}
                        className="text-purple-600 hover:text-purple-800 inline-flex items-center gap-1.5 font-medium text-sm group"
                      >
                        Add Admin
                      </button>

                      <button
                        onClick={() => toggleOrgStatus(org._id, org.isActive)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${org.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {org.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Create Organization Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md relative"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Plus size={24} />
                    </div>
                    <h2 className="text-xl font-semibold">Create New Organization</h2>
                  </div>

                  <form onSubmit={handleCreateOrganization} className="space-y-5">
                    <div>
                      <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name
                      </label>
                      <input
                        id="orgName"
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          'Create Organization '
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Admin Modal */}
          <AnimatePresence>
            {showAddAdminModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md relative"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <button
                    onClick={() => setShowAddAdminModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Shield size={24} />
                    </div>
                    <h2 className="text-xl font-semibold">All Users</h2>
                  </div>

                  {/* User List */}
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg bg-gray-50 hover:bg-purple-50 transition"
                        >
                          <p className="font-medium text-gray-800">{user.username}</p>
                          <button
                            onClick={() => handleAssignAdmin(user._id)}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Make Admin
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No users found.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Organization Details Modal */}
          <AnimatePresence>
            {selectedOrg && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md relative"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <button
                    onClick={() => setSelectedOrg(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Shield size={24} />
                    </div>
                    <h2 className="text-xl font-semibold">Organization Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-32 text-sm font-medium text-gray-500">Name</div>
                      <div className="flex-1 text-gray-800 font-medium">{selectedOrg.name}</div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-32 text-sm font-medium text-gray-500">Created</div>
                      <div className="flex-1 text-gray-800">{selectedOrg.createdAt}</div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-32 text-sm font-medium text-gray-500">Users</div>
                      <div className="flex-1 text-gray-800">{selectedOrg.userCount}</div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-32 text-sm font-medium text-gray-500">Status</div>
                      <div className="flex-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedOrg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedOrg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="w-full text-sm font-medium text-gray-500 mb-2">Admins</div>
                      <div className="space-y-2">
                        {selectedOrg.admins && selectedOrg.admins.length > 0 ? (
                          selectedOrg.admins.map((admin) => (
                            <div key={admin._id} className="flex justify-between items-center p-2 border rounded-lg bg-gray-50">
                              <p className="text-gray-800 font-medium">{admin.username}</p>
                              <button
                                onClick={() => handleRemoveAdmin(selectedOrg._id, admin._id, admin.username)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove Admin
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No admins assigned</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrgForAdmin(selectedOrg._id);
                        setShowAddAdminModal(true);
                        setSelectedOrg(null);
                      }}
                      className="w-full py-2.5 rounded-lg font-medium bg-purple-50 text-purple-600 hover:bg-purple-100"
                    >
                      Add Admin
                    </button>
                    <button
                      onClick={() => toggleOrgStatus(selectedOrg._id, selectedOrg.isActive)}
                      className={`w-full py-2.5 rounded-lg font-medium ${selectedOrg.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                    >
                      {selectedOrg.isActive ? 'Deactivate Organization' : 'Activate Organization'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default Organization;