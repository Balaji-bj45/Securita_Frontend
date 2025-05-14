import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FloatingLabelInput = ({ label, name, value, type = 'text', error, onChange }) => (
  <div className="relative w-full group">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`peer px-3 pt-5 pb-2 w-full border-b-2 text-sm text-gray-900 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder=" "
    />
    <label
      htmlFor={name}
      className="absolute text-sm text-gray-500 top-2 left-3 scale-75 origin-[0] transform peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-2 transition-all duration-200"
    >
      {label}
    </label>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const UserCreateForm = ({ onClose }) => {
  const [userData, setUserData] = useState({
    organizationIds: [],
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mfaEnabled: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/user/organization', {
        withCredentials: true
      });
      setOrganizations(res.data.orgs);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrganizationSelect = (org) => {
    const isSelected = userData.organizationIds.includes(org._id);
    let updatedOrganizations;
    
    if (isSelected) {
      updatedOrganizations = userData.organizationIds.filter(id => id !== org._id);
    } else {
      updatedOrganizations = [...userData.organizationIds, org._id];
    }
    
    setUserData(prev => ({ ...prev, organizationIds: updatedOrganizations }));
    
    // Update selected organizations for display
    if (isSelected) {
      setSelectedOrganizations(prev => prev.filter(o => o._id !== org._id));
    } else {
      setSelectedOrganizations(prev => [...prev, org]);
    }
  };

  const removeSelectedOrganization = (orgId) => {
    setUserData(prev => ({
      ...prev,
      organizationIds: prev.organizationIds.filter(id => id !== orgId)
    }));
    setSelectedOrganizations(prev => prev.filter(org => org._id !== orgId));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'organizationIds') {
      const updated = checked
        ? [...userData.organizationIds, value]
        : userData.organizationIds.filter((id) => id !== value);
      setUserData((prev) => ({ ...prev, organizationIds: updated }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username.trim()) newErrors.username = 'Username is required';
    else if (userData.username.length < 3) newErrors.username = 'Min 3 characters';

    if (!userData.password) newErrors.password = 'Password is required';
    else if (userData.password.length < 6) newErrors.password = 'Min 6 characters';

    if (!userData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) newErrors.email = 'Invalid email';
    else if (userData.email !== userData.email.toLowerCase()) newErrors.email = 'Email must be lowercase';

    if (!userData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (!userData.organizationIds.length) newErrors.organizationIds = 'Select at least one organization';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3001/api/user/create`,
        { ...userData },
        { withCredentials: true }
      );

      toast.success('User created successfully!');
      setUserData({
        organizationIds: [],
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        mfaEnabled: false
      });
      
      onClose(); // Hide modal first

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8  max-w-4xl mx-auto">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600">Create New User</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-10">
          <FloatingLabelInput label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} error={errors.firstName} />
          <FloatingLabelInput label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} error={errors.lastName} />
          <FloatingLabelInput label="Username" name="username" value={userData.username} onChange={handleChange} error={errors.username} />
          <FloatingLabelInput label="Password" name="password" type="password" value={userData.password} onChange={handleChange} error={errors.password} />
          <FloatingLabelInput label="Email" name="email" value={userData.email} onChange={handleChange} error={errors.email} />
          <FloatingLabelInput label="Phone" name="phone" value={userData.phone} onChange={handleChange} error={errors.phone} />
        </div>

        <div className="mt-11">
          <label className="block text-sm font-semibold mb-2 text-gray-700 mt-10">Organizations</label>
          
          {/* Selected organizations chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedOrganizations.map(org => (
              <div key={org._id} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                {org.organization}
                <button 
                  type="button" 
                  onClick={() => removeSelectedOrganization(org._id)}
                  className="ml-2 text-indigo-600 hover:text-indigo-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {/* Advanced dropdown with search */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 text-left border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Select Organizations
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                {/* Search input inside dropdown */}
                <div className="sticky top-0 bg-white p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                
                {/* Organization list */}
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <div
                      key={org._id}
                      onClick={() => handleOrganizationSelect(org)}
                      className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center ${
                        userData.organizationIds.includes(org._id) ? 'bg-indigo-50 text-indigo-700' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={userData.organizationIds.includes(org._id)}
                        readOnly
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{org.organization}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No organizations found</div>
                )}
              </div>
            )}
          </div>
          {errors.organizationIds && <p className="text-red-600 text-sm mt-2">{errors.organizationIds}</p>}
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            name="mfaEnabled"
            checked={userData.mfaEnabled}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="mfaEnabled" className="ml-2 block text-sm text-gray-700">Enable MFA for this user</label>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreateForm;