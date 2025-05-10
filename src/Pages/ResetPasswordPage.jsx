import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiKey, FiCheck } from "react-icons/fi";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setMessage("Please enter a new password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("Password updated successfully!");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 px-4">
      <motion.div
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-green-900/20 rounded-full">
              <FiKey className="text-green-400 text-3xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="text-sm text-gray-400 mt-1">Enter your new password</p>
        </div>

        {message && (
          <motion.div
            className="mb-6 p-3 bg-green-900/30 text-green-100 rounded-md flex items-center text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">
                <FiKey />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center text-white transition-all duration-300 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                Update Password <FiCheck className="ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="text-sm text-center text-gray-400 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline hover:text-green-300"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
