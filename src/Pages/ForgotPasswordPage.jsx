
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiArrowRight } from "react-icons/fi";

const ForgotPasswordPage = () => {
  const [userName, setuserName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName) {
      setMessage("Please enter your userName.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setMessage("If your Username is registered, a reset link has been sent through Email.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="absolute top-10 left-20 z-50">
        <img
          src="https://www.autointelli.com/assets/img/hero-logo.webp"
          alt="Logo"
          className="h-12 w-auto"
        />
      </div>

      <div className="w-full max-w-md bg-gray-600 py-10 px-6 rounded-2xl shadow-2xl sm:px-10">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          Enter your Username to receive a password reset link
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="name"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                required
                className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-800 transition duration-200"
                placeholder="userName"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-violet-500 hover:from-pink-700 hover:to-violet-600 rounded-lg shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
            {!loading && <FiArrowRight className="ml-2" />}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-300 text-sm">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-300 hover:text-blue-400 hover:underline font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
