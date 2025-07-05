import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import Navbar from "../Components/Navbar";
import axios from "axios";

function Group() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [orgUsers, setOrgUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [editingGroupIndex, setEditingGroupIndex] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [activeGroupIndex, setActiveGroupIndex] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);

  // Fetch on mount
  useEffect(() => {
    fetchGroups();
    fetchOrganizations();
  }, []);

  // Fetching Groups From Backend
  const fetchGroups = async () => {
    try {
      setIsFetching(true);
      const res = await axios.get("http://localhost:3001/api/user/groups", {
        withCredentials: true,
      });
      setGroups(res.data.groups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      setError("Failed to fetch groups");
    } finally {
      setIsFetching(false);
    }
  };

  // Filtered groups for search
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.users.some((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Fetching Organization from backend
  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/user/organization",
        { withCredentials: true }
      );
      setOrganizations(res.data.orgs);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      setError("Failed to fetch organizations");
    }
  };

  // Create Group API
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrg || !groupName.trim()) {
      setError("Please select organization and enter group name");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/user/create/group",
        {
          name: groupName,
          organizationId: selectedOrg,
          userIds: [],
        },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Group created successfully!");
      setGroupName("");
      setSelectedOrg("");
      await fetchGroups();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create group"
      );
      console.error("Failed to create group:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing group
  const startEditingGroup = (index) => {
    setEditingGroupIndex(index);
    setEditGroupName(filteredGroups[index].name);
  };

  // Update Group API
  const saveEditedGroup = async () => {
    if (!editGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const group = filteredGroups[editingGroupIndex];
      if (!group) {
        setError("Group not found");
        return;
      }

      const payload = {
        name: editGroupName,
        userIds: group.users.map((u) => u._id),
        organizationId: group.organization?._id,
      };

      const token = localStorage.getItem("authToken");
      const res = await axios.put(
        `http://localhost:3001/api/user/group/${group._id}`,
        payload,
        { withCredentials: true }
      );

      // Update groups state
      const updatedGroups = groups.map((g) =>
        g._id === group._id
          ? {
              ...res.data.group,
              users: group.users,
              organization: group.organization,
            }
          : g
      );

      setGroups(updatedGroups);
      setMessage(res.data.message || "Group updated successfully");
      setEditingGroupIndex(null);
      setEditGroupName("");
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  // Delete Group API
  const handleDeleteGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `http://localhost:3001/api/user/group/${groupId}`,
        { withCredentials: true }
      );

      setGroups((prev) => prev.filter((group) => group._id !== groupId));
      setMessage("Group deleted successfully");
    } catch (error) {
      console.error("Failed to delete group:", error);
      setError(error?.response?.data?.message || "Error deleting group");
    }
  };

  // Fetch Users By Organization API
  const fetchUsersByOrganization = async (orgId) => {
    if (!orgId) return;
    try {
      setFetchingUsers(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `http://localhost:3001/api/user/by-organization/${orgId}`,
        { withCredentials: true }
      );
      setOrgUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users by organization:", err);
      setError("Failed to fetch users");
    } finally {
      setFetchingUsers(false);
    }
  };

  // Handle opening add user section
  const handleAddUserClick = async (groupIndex) => {
    setActiveGroupIndex(groupIndex);
    const group = filteredGroups[groupIndex];
    await fetchUsersByOrganization(group.organization?._id);
  };


 // Add User to Group By SuperAdmin

 const confirmAddUserToGroup = async (groupIndex) => {
  const group = filteredGroups[groupIndex];
  if (!selectedUserId) return;

  try {
    setLoading(true);
    setError(null);
    setMessage(null);

    // Create new userIds array
    const newUserIds = [...group.users.map((u) => u._id), selectedUserId];

    const payload = {
      name: group.name,
      organizationId: group.organization?._id,
      userIds: newUserIds,
    };

    const res = await axios.put(
      `http://localhost:3001/api/user/group/${group._id}`,
      payload,
      { withCredentials: true }
    );

    // Update local state
    const updatedGroups = groups.map((g) =>
      g._id === group._id
        ? {
            ...res.data.group,
            users: [
              ...group.users,
              orgUsers.find((u) => u._id === selectedUserId),
            ],
            organization: group.organization,
          }
        : g
    );
    setGroups(updatedGroups);
    setMessage("User added to group successfully!");
    setSelectedUserId("");
    setActiveGroupIndex(null);
  } catch (err) {
    console.error("Failed to add user:", err);
    setError(err.response?.data?.message || "Failed to add user");
  } finally {
    setLoading(false);
  }
};

  // Remove User to Group By Superadmin

  const removeUser = async (groupIndex, userIndex) => {
    const group = filteredGroups[groupIndex];
    const userToRemove = group.users[userIndex];
    if (!userToRemove) return;

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      // Remove user from list
      const newUserIds = group.users
        .filter((u) => u._id !== userToRemove._id)
        .map((u) => u._id);

      const payload = {
        name: group.name,
        organizationId: group.organization?._id,
        userIds: newUserIds,
      };

      const res = await axios.put(
        `http://localhost:3001/api/user/group/${group._id}`,
        payload,
        { withCredentials: true }
      );

      // Update local state
      const updatedGroups = groups.map((g) =>
        g._id === group._id
          ? {
              ...res.data.group,
              users: group.users.filter((u) => u._id !== userToRemove._id),
              organization: group.organization,
            }
          : g
      );
      setGroups(updatedGroups);
      setMessage("User removed from group successfully!");
    } catch (err) {
      console.error("Failed to remove user:", err);
      setError(err.response?.data?.message || "Failed to remove user");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Group Management
              </h1>
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Create New Group
            </h2>
            <form
              onSubmit={onSubmit}
              className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
            >
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
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.organization}
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
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedOrg || !groupName.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <FiPlus /> Create Group
                  </>
                )}
              </button>
            </form>

            {/* Show success or error messages */}
            {message && <p className="text-green-500 mt-2">{message}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </motion.div>

          {/* Group Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Groups ({filteredGroups.length})
            </h2>

            {isFetching ? (
              <p className="text-gray-500 text-center">Loading...</p>
            ) : filteredGroups.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
              >
                <FiUsers className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">
                  No groups found
                </h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm
                    ? "Try a different search term"
                    : "Create your first group to get started"}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredGroups.map((group, index) => (
                    <motion.div
                      key={group._id}
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
                              onKeyPress={(e) =>
                                e.key === "Enter" && saveEditedGroup()
                              }
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
                                  onClick={() => handleDeleteGroup(group._id)}
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
                          Organization:{" "}
                          <span className="font-medium text-gray-700">
                            {group.organization?.organization}
                          </span>
                        </p>

                        {/* Users */}
                        <div className="space-y-1">
                          {group.users.length === 0 ? (
                            <p className="text-gray-400 italic text-sm">
                              No users in this group
                            </p>
                          ) : (
                            group.users.map((user, userIndex) => (
                              <div
                                key={user._id}
                                className="flex justify-between items-center text-sm border border-gray-100 rounded px-2 py-1 bg-gray-50"
                              >
                                <span className="text-gray-800">
                                  {user.username}
                                </span>
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
                              value={selectedUserId}
                              onChange={(e) =>
                                setSelectedUserId(e.target.value)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-md w-full"
                              disabled={fetchingUsers}
                            >
                              <option value="">
                                {fetchingUsers
                                  ? "Loading..."
                                  : "-- Select user --"}
                              </option>
                              {orgUsers
                                .filter(
                                  (orgUser) =>
                                    !group.users.some(
                                      (gUser) => gUser._id === orgUser._id
                                    )
                                )
                                .map((orgUser) => (
                                  <option key={orgUser._id} value={orgUser._id}>
                                    {orgUser.username}
                                  </option>
                                ))}
                            </select>
                            <button
                              onClick={() => confirmAddUserToGroup(index)}
                              disabled={!selectedUserId || fetchingUsers}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setActiveGroupIndex(null);
                                setSelectedUserId("");
                              }}
                              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddUserClick(index)}
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
    </>
  );
}

export default Group;
