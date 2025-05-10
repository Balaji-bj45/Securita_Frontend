import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            let res = await axios.post(
                'http://localhost:3001/api/role/admin/login',
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true, // Ensure credentials are sent
                }
            );
    
            console.log('Response:', res);  // Check the response
    
            // Don't extract the token from the response, as it's now handled by cookies
            if (res.status === 200) {
                localStorage.setItem('isLogedin', 'true');
                navigate('/home-page'); // Redirect after successful login
            }
    
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">Securita</h2>
                {error && <p className="mb-4 text-center text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
