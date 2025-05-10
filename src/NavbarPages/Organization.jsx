import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Organization() {
  const [orgName, setOrgName] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [adminData, setAdminData] = useState({ username: '', password: '', organizationId: '' });
  const [orgDetails, setOrgDetails] = useState(null);


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

  const fetchOrgById = async (orgId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/user/get/organization/${orgId}`, {
        withCredentials: true,
      });
      setOrgDetails(res.data); // <== Fix here
    } catch (error) {
      console.error('Error fetching organization by ID:', error);
    }
  };


  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3001/api/user/create/organization',
        { organization: orgName },
        { withCredentials: true }
      );
      //console.log('create orgs:', res);
      setOrgName('');
      fetchOrganizations();
    } catch (err) {
      console.error('Error creating organization:', err);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3001/api/user/create/admin',
        adminData,
        { withCredentials: true }
      );
      console.log('creating admin:', res);
      alert('Admin created successfully');
      setAdminData({ username: '', password: '', organizationId: '' });
    } catch (err) {
      console.error('Error creating admin:', err);
    }
  };


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Superadmin Dashboard</h1>

      {/* Create Organization Form */}
      <form onSubmit={handleCreateOrg} className="bg-white p-4 rounded shadow space-y-3 w-full max-w-md">
        <h2 className="text-xl font-semibold">Create Organization</h2>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Organization Name"
          className="w-full px-3 py-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create
        </button>
      </form>

      {/* List of Organizations */}
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl mt-6">
        <h2 className="text-xl font-semibold mb-4">All Organizations</h2>
        <ul className="divide-y divide-gray-200">
          {orgs.map((org) => (
            <li key={org._id} className="py-2 px-2 rounded flex justify-between items-center hover:bg-gray-100">
              <span className="font-medium">{org.organization}</span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedOrg(org);
                    setAdminData((prev) => ({ ...prev, organizationId: org._id }));
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Select
                </button>
                <button
                  onClick={() => fetchOrgById(org._id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  View
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Admin Form */}
      {selectedOrg && (
        <form
          onSubmit={handleCreateAdmin}
          className="bg-white p-4 rounded shadow space-y-3 w-full max-w-md mt-6"
        >
          <h2 className="text-xl font-semibold">
            Create Admin for: <span className="text-blue-600">{selectedOrg.organization}</span>
          </h2>
          <input
            type="text"
            value={adminData.username}
            placeholder="Username"
            onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            value={adminData.password}
            placeholder="Password"
            onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Admin
          </button>
        </form>
      )}
      {orgDetails.orgs && (
        <div className="bg-white p-4 rounded shadow w-full max-w-2xl mt-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">{ orgDetails.orgs.organization }</h2>
          <p><strong>Organization Admin:</strong> {orgDetails.admins.length > 0 ? orgDetails.admins.map(a => a.username).join(', ') : 'None'}</p>
          <p><strong>User Count:</strong> {orgDetails.userCount}</p>
        </div>
      )}
    </div>
  );
}

export default Organization;
