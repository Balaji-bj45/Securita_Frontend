import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShield, FiArrowRight } from "react-icons/fi";
import backgroundImage from "../../assets/back-img.jpg";
import alicedark from "../../assets/Alice-dark.png";


const ScanQrPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          toast.error(msg); // only show toast for actual error
          setError(msg);
        }
        setQrCode(null);
      }
    };
    fetchQrCode();
  }, [userId]);

  const handleVerify = async () => {
    if (token.length !== 6) {
      setError("Please enter a 6-digit code.");
      toast.error("Please enter a 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/user/verify-mfa",
        { userId, token },
        { withCredentials: true }
      );

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }

      toast.success("MFA Verified!");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0" />

      <div className="relative z-10 flex max-w-5xl w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {!isMobile && (
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 text-white">
            <img src={alicedark} alt="Alice AI" className="rounded-full mb-4" />
            <div className="text-zinc-200 text-justify leading-snug">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Open your <strong>authenticator app</strong> (e.g., Google
                  Authenticator, Microsoft Authenticator).
                </li>
                <li>
                  <strong>Scan the QR code</strong> below to register your
                  device for MFA.
                </li>
                <li>
                  Once linked, <strong>enter the 6-digit code</strong> displayed
                  in your app to verify.
                </li>
              </ol>
            </div>
          </div>
        )}

        <div className="w-full md:w-1/2 p-8 md:p-10 bg-black/40">
          <div className="flex justify-center mb-4 md:hidden">
            <img src={alicedark} alt="Alice AI" className="rounded-full" />
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-1 hidden md:block">
            MFA Verification
          </h2>
          <p className="text-center text-gray-50 mb-6">
            Scan QR code and enter your 6-digit code.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {qrCode ? (
            <div className="flex justify-center mb-4">
              <img
                src={qrCode}
                alt="Scan QR"
                className="w-40 h-40 rounded-lg border border-white/20"
              />
            </div>
          ) : error && error.includes("QR code already shown") ? null : (
            <p className="text-center text-gray-300 mb-4">Loading QR Code...</p>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-50 mb-1">
              6-Digit Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiShield className="text-gray-400" />
              </div>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                onKeyDown={handleKeyDown}
                maxLength={6}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm text-white bg-white/10 placeholder-gray-200"
                placeholder="Enter 6-digit code"
              />
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || token.length !== 6}
            className="w-full flex justify-center items-center py-3 px-1 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Verify <FiArrowRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanQrPage;

