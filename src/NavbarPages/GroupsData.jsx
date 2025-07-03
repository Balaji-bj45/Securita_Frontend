import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiUsers, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import Navbar from '../Components/Navbar';

function Group() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  const [activeGroupIndex, setActiveGroupIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGroupIndex, setEditingGroupIndex] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [organizations, setOrganizations] = useState([
    { name: 'Sundaram Finance', users: ['Balaji', 'Akash'] },
    { name: 'Sriram Finance', users: ['Vishnu', 'Priya'] },
    { name: 'ZOHO', users: ['Charlie', 'Catherine'] },
  ]);
  const [selectedOrg, setSelectedOrg] = useState('');

  useEffect(() => {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const createGroup = () => {
    if (!groupName.trim() || !selectedOrg) return;
    setGroups([
      ...groups,
      {
        name: groupName,
        organization: selectedOrg,
        users: [],
        createdAt: new Date().toISOString(),
      },
    ]);
    setGroupName('');
    setSelectedOrg('');
  };

  const addUserToGroup = () => {
    if (!userName.trim() || activeGroupIndex === null) return;
    const updatedGroups = [...groups];
    updatedGroups[activeGroupIndex].users.push({
      name: userName,
      joinedAt: new Date().toISOString(),
    });
    setGroups(updatedGroups);
    setUserName('');
    setActiveGroupIndex(null);
  };

  const startEditingGroup = (index) => {
    setEditingGroupIndex(index);
    setEditGroupName(groups[index].name);
  };

  const saveEditedGroup = () => {
    if (!editGroupName.trim() || editingGroupIndex === null) return;
    const updatedGroups = [...groups];
    updatedGroups[editingGroupIndex].name = editGroupName;
    setGroups(updatedGroups);
    setEditingGroupIndex(null);
  };

  const deleteGroup = (index) => {
    const updatedGroups = groups.filter((_, idx) => idx !== index);
    setGroups(updatedGroups);
    setGroupToDelete(null);
  };

  const removeUser = (groupIndex, userIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].users.splice(userIndex, 1);
    setGroups(updatedGroups);
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.users.some((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Group Management</h1>
              <p className="text-gray-600">Create and manage your groups</p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search groups or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Create Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Group</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Organization
                </label>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select --</option>
                  {organizations.map((org, idx) => (
                    <option key={idx} value={org.name}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createGroup()}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={createGroup}
                disabled={!selectedOrg || !groupName.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <FiPlus /> Create Group
              </button>
            </div>
          </motion.div>

          {/* Group Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Groups ({filteredGroups.length})</h2>

            {filteredGroups.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
              >
                <FiUsers className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No groups found</h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm ? 'Try a different search term' : 'Create your first group to get started'}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredGroups.map((group, index) => (
                    <motion.div
                      key={group.name + index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      layout
                      className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          {editingGroupIndex === index ? (
                            <input
                              type="text"
                              value={editGroupName}
                              onChange={(e) => setEditGroupName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveEditedGroup()}
                              className="px-3 py-1 border border-gray-300 rounded-md font-semibold text-lg"
                            />
                          ) : (
                            <h2 className="text-xl font-semibold text-gray-800 truncate max-w-[180px]">
                              {group.name}
                            </h2>
                          )}
                          <div className="flex gap-2">
                            {editingGroupIndex === index ? (
                              <button
                                onClick={saveEditedGroup}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Save"
                              >
                                <FiX className="transform rotate-45" />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditingGroup(index)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit"
                                >
                                  <FiEdit2 size={18} />
                                </button>
                                <button
                                  onClick={() => setGroupToDelete(index)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Delete"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-500">
                          Organization: <span className="font-medium text-gray-700">{group.organization}</span>
                        </p>

                        {/* Users */}
                        <div className="space-y-1">
                          {group.users.length === 0 ? (
                            <p className="text-gray-400 italic text-sm">No users in this group</p>
                          ) : (
                            group.users.map((user, userIndex) => (
                              <div
                                key={user.name + userIndex}
                                className="flex justify-between items-center text-sm border border-gray-100 rounded px-2 py-1 bg-gray-50"
                              >
                                <span className="text-gray-800">{user.name}</span>
                                <button
                                  onClick={() => removeUser(index, userIndex)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <FiX />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add User */}
                        {activeGroupIndex === index ? (
                          <div className="flex items-center gap-2 mt-3">
                            <select
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md w-full"
                            >
                              <option value="">-- Select user --</option>
                              {organizations
                                .find((org) => org.name === group.organization)
                                ?.users.filter((orgUser) => !group.users.some((gUser) => gUser.name === orgUser))
                                .map((orgUser, idx) => (
                                  <option key={idx} value={orgUser}>
                                    {orgUser}
                                  </option>
                                ))}
                            </select>
                            <button
                              onClick={addUserToGroup}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveGroupIndex(index)}
                            className="mt-3 text-sm text-blue-600 hover:underline"
                          >
                            + Add User
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {groupToDelete !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-gray-800">Delete Group</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this group?</p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setGroupToDelete(null)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteGroup(groupToDelete)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Group;
