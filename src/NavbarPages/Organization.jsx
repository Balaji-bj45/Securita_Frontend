import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';

function Organization() {
  const [orgName, setOrgName] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3001/api/user/create/organization',
        { organization: orgName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      await axios.post(
        'http://localhost:3001/api/user/create/admin',
        {
          organizationId: selectedOrg._id,
          username,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsername('');
      setPassword('');
      alert('Admin created successfully');
    } catch (err) {
      console.error('Error fetching organization details:', err);
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
            <li
              key={org._id}
              className="py-2 cursor-pointer hover:bg-gray-100 px-2 rounded"
              onClick={() => setSelectedOrg(org)}
            >
              <span className="font-medium">{org.organization}</span>
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
            value={username}
            placeholder="Admin Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            value={password}
            placeholder="Admin Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Admin
          </button>
        </form>
      )}
    </div>
  );
}

export default Organization;
