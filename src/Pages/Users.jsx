import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

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
  const [organization, setOrganization] = useState([]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user/organization',
        { withCredentials: true }
      );
      setOrganization(response.data.orgs);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleUserCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:3001/api/user/create`,
        {
          ...userData,
          mfaEnabled: false, // initially disabled
        },
        { withCredentials: true }
      );

      showToast('User created successfully!');

      if (userData.mfaEnabled) {
        await axios.get(
          `http://localhost:3001/api/user/generate-mfa/${response.data.user._id}`,
          { withCredentials: true }
        );
        showToast('MFA enabled for user. User can now set it up.');
      }

      setUserData({
        organizationIds: [],
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        mfaEnabled: false,
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      showToast(msg, 'error');
      console.log(error.response);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type = 'success') => {
    toast[type](() => (
      <div className="flex items-center">
        {type === 'success' ? (
          <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="font-medium">{message}</span>
      </div>
    ), {
      position: 'top-center',
      duration: 4000,
      style: {
        minWidth: '300px',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backgroundColor: type === 'success' ? '#f0fdf4' : '#fef2f2',
        color: '#111827',
      },
      iconTheme: {
        primary: type === 'success' ? '#10b981' : '#ef4444',
        secondary: '#fff',
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
    if (!userData.organizationIds || userData.organizationIds.length === 0) {
      newErrors.organizationIds = 'At least one organization must be selected';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" containerStyle={{ top: '5rem' }} toastOptions={{ style: { minWidth: '300px' } }} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600">Create New User</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleUserCreate} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['firstName', 'lastName', 'username', 'password', 'email', 'phone'].map((field) => (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                <span className="text-red-500 ms-1">*</span>
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={userData[field]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Organizations</label>
            <select
              name="organizationIds"
              multiple
              value={userData.organizationIds || []}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                setUserData((prev) => ({ ...prev, organizationIds: selectedOptions }));
              }}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {organization.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.organization}
                </option>
              ))}
            </select>
            {errors.organizationIds && (
              <p className="text-sm text-red-600">{errors.organizationIds}</p>
            )}
          </div>


          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">MFA Enabled</label>
            <input
              type="checkbox"
              name="mfaEnabled"
              checked={userData.mfaEnabled}
              onChange={() => setUserData(prev => ({ ...prev, mfaEnabled: !prev.mfaEnabled }))}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreateForm;
