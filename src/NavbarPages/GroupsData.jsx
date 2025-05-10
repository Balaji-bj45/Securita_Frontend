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

  // Load groups from localStorage on component mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  // Save groups to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const createGroup = () => {
    if (!groupName.trim()) return;
    setGroups([...groups, { 
      name: groupName, 
      users: [],
      createdAt: new Date().toISOString()
    }]);
    setGroupName('');
  };

  const addUserToGroup = () => {
    if (!userName.trim() || activeGroupIndex === null) return;
    const updatedGroups = [...groups];
    updatedGroups[activeGroupIndex].users.push({
      name: userName,
      joinedAt: new Date().toISOString()
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

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.users.some(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
            
            {/* Search bar */}
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

          {/* Group creation section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Group</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && createGroup()}
                />
              </div>
              <button
                onClick={createGroup}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                <FiPlus /> Create Group
              </button>
            </div>
          </motion.div>

          {/* Groups display section */}
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
                        {/* Group header */}
                        <div className="flex justify-between items-start">
                          {editingGroupIndex === index ? (
                            <input
                              type="text"
                              value={editGroupName}
                              onChange={(e) => setEditGroupName(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-md font-semibold text-lg"
                              onKeyPress={(e) => e.key === 'Enter' && saveEditedGroup()}
                            />
                          ) : (
                            <h2 className="text-xl font-semibold text-gray-800 truncate max-w-[180px]">
                              {group.name}
                            </h2>
                          )}
                          <div className="flex gap-2">
                            {editingGroupIndex === index ? (
                              <>
                                <button
                                  onClick={saveEditedGroup}
                                  className="text-green-600 hover:text-green-800 p-1"
                                  title="Save"
                                >
                                  <FiX className="transform rotate-45" />
                                </button>
                              </>
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

                        {/* Users section */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-700 flex items-center gap-2">
                              <FiUsers /> Members ({group.users.length})
                            </h3>
                            <button
                              onClick={() => 
                                activeGroupIndex === index 
                                  ? setActiveGroupIndex(null) 
                                  : setActiveGroupIndex(index)
                              }
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <FiPlus size={14} /> 
                              {activeGroupIndex === index ? 'Cancel' : 'Add'}
                            </button>
                          </div>

                          {group.users.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                              {group.users.map((user, idx) => (
                                <li key={idx} className="py-2 flex justify-between items-center">
                                  <span className="text-gray-700">{user.name}</span>
                                  <button
                                    onClick={() => removeUser(index, idx)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <FiX size={16} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No members yet</p>
                          )}
                        </div>

                        {/* Add user form */}
                        {activeGroupIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 pt-2 border-t border-gray-100"
                          >
                            <input
                              type="text"
                              placeholder="Enter user name"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              onKeyPress={(e) => e.key === 'Enter' && addUserToGroup()}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={addUserToGroup}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
                              >
                                <FiPlus size={16} /> Add User
                              </button>
                              <button
                                onClick={() => setActiveGroupIndex(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Delete confirmation overlay */}
        {groupToDelete !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Group</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{groups[groupToDelete]?.name}" group? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setGroupToDelete(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteGroup(groupToDelete);
                    setGroupToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

export default Group;