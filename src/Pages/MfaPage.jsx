import React, { useState } from 'react';
import { FiShield, FiEye, FiEyeOff } from 'react-icons/fi';

const MfaPage = () => {
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => setOtp(e.target.value);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-8">
            {/* MFA Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="https://www.autointelli.com/assets/img/hero-logo.webp"
                alt="Company Logo"
                className="h-[90px]"
              />
            </div>

            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
              Multi-Factor Authentication
            </h2>

            <p className="text-sm text-center text-gray-600 mb-6">
              Scan the QR code using your authenticator app and enter the 6-digit OTP.
            </p>

            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-6">
              <div className="border border-dashed border-gray-300 rounded-lg p-4">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/YourApp:MFA?secret=JBSWY3DPEHPK3PXP&issuer=YourApp"
                  alt="MFA QR Code"
                  className="h-[150px] w-[150px]"
                />
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiShield className="text-gray-400" />
                </div>
                <input
                  type={showOtp ? 'text' : 'password'}
                  value={otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6-digit code"
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showOtp ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7F55B1] hover:bg-[#6e45a0] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaPage;
