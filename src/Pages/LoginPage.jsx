import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import toast from "react-hot-toast";

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   setError("");
    //   setLoading(true);

    //   try {
    //     // 1️⃣ Try superadmin login first
    //     let response = await axios.post(
    //       "http://localhost:3001/api/role/admin/login",
    //       formData,
    //       {
    //         headers: { "Content-Type": "application/json" },
    //         withCredentials: true,
    //       }
    //     );
    //     let role = "admin";

    //     // 2️⃣ If admin login failed, try user login
    //     if (response.status !== 200) {
    //       response = await axios.post(
    //         "http://localhost:3001/api/auth/user/login",
    //         formData,
    //         {
    //           headers: { "Content-Type": "application/json" },
    //           withCredentials: true,
    //         }
    //       );
    //       role = "user";
    //     }

    //     const data = response.data;
    //     console.log("Login response:", data);

    //     // 3️⃣ Check if MFA is enabled
    //     if (role === "user" && data.mfaEnabled && data.userId) {
    //       // Redirect to MFA page (store userId in localStorage if needed)
    //       localStorage.setItem("userId", data.userId);
    //       navigate(`/mfa-verify/${data.userId}`);
    //       return;
    //     }

    //     // 4️⃣ Login success: store token & role
    //     if (data.token) {
    //       localStorage.setItem("authToken", data.token);
    //       localStorage.setItem("role", role);
    //       navigate("/home-page");
    //     } else {
    //       throw new Error("No token returned from server");
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     setError(
    //       err.response?.data?.message ||
    //         "Login failed. Please check your credentials."
    //     );
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      let role = "";
      let data = null;

      try {
        try {
          // 1️⃣ Try admin login
          const res = await axios.post(
            "http://localhost:3001/api/role/admin/login",
            formData,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          role = "admin";
          data = res.data;
        } catch (err) {
          // 2️⃣ If admin login failed, try user login
          if (err.response && err.response.status === 401) {
            const res = await axios.post(
              "http://localhost:3001/api/auth/user/login",
              formData,
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            role = "user";
            data = res.data;
          } else {
            throw err; // Other errors like network/server error
          }
        }

        console.log("Login response data:", data);

        // 3️⃣ Check for MFA requirement based on backend message
        if (role === "user" && data.message === "MFA required" && data.userId) {
          localStorage.setItem("userId", data.userId);
          navigate(`/mfa-verify/${data.userId}`);
          return;
        }

        // 4️⃣ Otherwise, login success
        if (data.token) {
          localStorage.setItem("authToken", res.data.token);

          localStorage.setItem("role", role);
          toast.success(`Login successful as ${role}`);
          navigate("/home-page");
        } else {
          throw new Error("No token returned from server");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Login failed.");
        setError(err.response?.data?.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    };
      
      

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="p-8">
                        <div className="flex justify-center mb-6">
                            <img
                                src="https://www.autointelli.com/assets/img/hero-logo.webp"
                                alt="Descriptive alt text"
                                className="h-[100px]  "
                            />
                        </div>


                        {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">Welcome to Securita</h2> */}


                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>



                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7F55B1] hover:bg-[#7F55B1] focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="animate-spin mr-2" />
                                        Signing in...
                                    </>
                                ) : 'Sign in'}
                            </button>
                        </form>
                    </div>


                </div>


            </div>
        </div>
    );
};

export default LoginPage;