

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';

function Organization() {
  const [orgName, setOrgName] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/user/organization', {
        withCredentials: true,
      });
      setOrgs(res.data.orgs);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    try {
      const orgRes = await axios.post(
        'http://localhost:3001/api/user/create/organization',
        { organization: orgName },
        { withCredentials: true }
      );

      const orgId = orgRes.data.org._id;

      await axios.post(
        'http://localhost:3001/api/user/create/admin',
        { ...adminData, organizationId: orgId },
        { withCredentials: true }
      );

      alert('Organization and Admin created successfully!');
      setOrgName('');
      setAdminData({ username: '', password: '' });
      setShowModal(false);
      fetchOrganizations();
    } catch (err) {
      console.error('Error creating organization/admin:', err);
    }
  };

  const handleViewClick = async (orgId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/user/get/organization/${orgId}`, {
        withCredentials: true,
      });

      const { orgs, userCount, admins } = res.data;

      setSelectedOrg({
        name: orgs.organization,
        userCount: userCount,
        adminUsername: admins.length > 0 ? admins[0].username : 'N/A',
      });
    } catch (err) {
      console.error('Error fetching organization details:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Organizations</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Organization
          </button>
        </div>

        {/* Organizations Table */}
        <div className="bg-white shadow rounded overflow-x-auto mx-[300px]">
          <table className="min-w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Organization Name</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org, idx) => (
                <tr key={org._id} className="border-t">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{org.organization}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleViewClick(org._id)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Creating Organization */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-4 text-center">Create Organization & Admin</h2>
              <form onSubmit={handleCreateOrganization} className="space-y-4">
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Admin Username"
                  value={adminData.username}
                  onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={adminData.password}
                  onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        )}

        {/* View Organization Modal */}
        {selectedOrg && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
              <button
                onClick={() => setSelectedOrg(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-4 text-center">Organization Details</h2>
              <p className="mb-2">
                <strong>Organization:</strong> {selectedOrg.name}
              </p>
              <p className="mb-2">
                <strong>Admin Username:</strong> {selectedOrg.adminUsername}
              </p>
              <p className="mb-2">
                <strong>User Count:</strong> {selectedOrg.userCount}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Organization;