import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShield, FiEye, FiEyeOff } from "react-icons/fi";

const MfaPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch QR code on mount
  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/auth/mfa-qrcode/${userId}`,
          { withCredentials: true }
        );
        setQrCode(res.data.qrCodeImage);
        setError("");
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load QR code.";
        if (!msg.includes("QR code already shown")) {
          toast.error(msg);
        }
        setError(msg);
        setQrCode(null);
      }
    };
    fetchQrCode();
  }, [userId]);

  // Handle verification
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `http://localhost:3001/api/auth/verify-mfa/${userId}`,
        { token: otp },
        { withCredentials: true }
      );

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }

      toast.success("MFA Verified!");
      navigate("/home-page", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setOtp(e.target.value.replace(/\D/g, ""));
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-8">
            {/* Logo */}
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
              Scan the QR code using your authenticator app and enter the
              6-digit OTP.
            </p>

            {/* Show error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm text-center">
                {error}
              </div>
            )}

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              {qrCode ? (
                <div className="border border-dashed border-gray-300 rounded-lg p-2">
                  <img
                    src={qrCode}
                    alt="MFA QR Code"
                    className="h-[150px] w-[150px]"
                  />
                </div>
              ) : error.includes("QR code already shown") ? null : (
                <p className="text-gray-500">Loading QR Code...</p>
              )}
            </div>

            {/* OTP Input */}
            <div className="space-y-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiShield className="text-gray-400" />
                </div>
                <input
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7F55B1] hover:bg-[#6e45a0] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaPage;
