"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utility/Config";
import { validateCompanySignup } from "../../utility/validation";


export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyType: "",
    address: "",
  });

  const fileInputRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  const next = () => {
    setError(null);
    setSuccessMessage(null);
    setStep((s) => Math.min(3, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const openUpload = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  // Handle Step 1 form submission with Axios
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    const validation = validateCompanySignup(formData);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const signupData = {
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        companyType: formData.companyType,
        address: formData.address.trim(),
      };

      // Make API call using Axios
      const response = await axios.post(`${BASE_URL}/company/signup`, signupData);

      if (response.status === 201 && response.data) {
        const { token, company } = response.data;

        // Save token and company info to localStorage
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("companyId", company._id);
          localStorage.setItem("companyName", company.companyName);
          localStorage.setItem("companyEmail", company.email);
          setCompanyId(company._id);
        }

        setSuccessMessage("Company registered successfully!");
        setLoading(false);

        // Move to next step after short delay
        setTimeout(() => {
          next();
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
      console.error("Signup error:", err);

      // Handle different error types
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.msg || err.response.data?.message || "Server error occurred";
        setError(errorMessage);
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server. Please check your connection.");
      } else {
        // Error in request setup
        setError(err.message || "An error occurred during signup");
      }
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex items-center justify-center bg-[#E8EDFF] p-4 font-inter py-6">
      
      {/* Animation Wrapper */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >

        {/* =====================================================
                     STEP 1 → ORGANIZATION DETAILS
        ======================================================*/}
        {step === 1 && (
          <div className="w-[95vw] bg-white shadow-xl rounded-[30px] p-10">

            <div className="flex flex-col items-center">
              <img src="/logo.svg" alt="TASK FLLET" className="h-10 mb-3" />

              <p className="text-sm text-gray-500 mb-1">1 / 2</p>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Customize your Organization
              </h1>

              <p className="text-gray-500 text-center max-w-lg mb-8">
                Setup your organization for members that may join later.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-[20px] text-red-700 text-sm flex items-center gap-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="max-w-3xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-[20px] text-green-700 text-sm flex items-center gap-3">
                <span>✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleStep1Submit}
              className="space-y-6 max-w-3xl mx-auto"
            >
              {/* Company Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                />
              </div>

              {/* Company Email */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Company Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Company Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Enter Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-Enter Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  />
                </div>
              </div>

              {/* Company Type */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Company Type *
                </label>

                <div className="relative">
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-[30px] px-5 py-3 appearance-none focus:ring-2 focus:ring-[#20A4F3] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  >
                    <option value="">Select Company Type</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>

                  <ChevronDown
                    size={20}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Company Address *
                </label>
                <textarea
                  name="address"
                  rows={3}
                  placeholder="Enter Company Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-[22px] px-5 py-3 resize-none focus:ring-2 focus:ring-[#20A4F3] disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-gray-600">
                  Get exciting offers on mail
                </span>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#20A4F3] text-white font-semibold px-12 py-3 rounded-[30px] hover:bg-[#1a8bd1] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 min-w-[200px]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =====================================================
                     STEP 2 → LOGO UPLOAD
        ======================================================*/}
        {step === 2 && (
          <div className="w-[95vw] bg-white shadow-xl rounded-[30px] p-12">

            <button onClick={prev} className="text-[#20A4F3] text-sm mb-4">
              ← Back
            </button>

            <div className="flex flex-col items-center">
              <img src="/logo.svg" className="h-10 mb-3" />

              <p className="text-sm text-gray-500 mb-1">2 / 2</p>

              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Customize your Organization
              </h1>

              <p className="text-gray-500 text-center max-w-lg mb-10">
                Upload your company logo to personalize your dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center">
              
              {/* Logo Preview */}
              <div className="h-40 w-40 rounded-full border-4 border-[#20A4F3] flex items-center justify-center text-[#20A4F3] text-5xl overflow-hidden">
                {preview ? (
                  <img src={preview} className="h-full w-full object-cover" />
                ) : (
                  <span>📦</span>
                )}
              </div>

              <button
                onClick={openUpload}
                className="mt-6 border border-gray-300 px-6 py-2 rounded-[20px] hover:bg-gray-50"
              >
                ⬆ Upload Logo
              </button>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <button
                onClick={next}
                className="mt-8 bg-[#20A4F3] text-white font-semibold px-12 py-3 rounded-[30px]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
                     STEP 3 → SUCCESS SCREEN
        ======================================================*/}
        {step === 3 && (
          <div className="w-[95vw] bg-white rounded-[30px] p-12 flex flex-col items-center shadow-xl">

            <img src="/logo.svg" className="h-10 mb-6" />

            <div className="w-40 h-40 rounded-full border-8 border-[#20A4F3] flex items-center justify-center text-[#20A4F3] text-6xl mb-8">
              ✓
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Account created successfully!
            </h2>

            <p className="text-gray-500 text-center max-w-lg mb-6">
              Welcome aboard! Start your success journey with TaskFleet!
            </p>

            {/* Company ID Display */}
            {companyId && (
              <div className="bg-blue-50 border-2 border-[#20A4F3] rounded-[20px] p-6 mb-8 w-full max-w-md">
                <p className="text-sm text-gray-600 mb-2 text-center">Your Company ID</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-2xl font-bold text-[#20A4F3] tracking-wider">
                    {companyId}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(companyId);
                      alert("Company ID copied to clipboard!");
                    }}
                    className="text-[#20A4F3] hover:bg-blue-100 p-2 rounded-lg transition"
                    title="Copy Company ID"
                  >
                    📋
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Share this ID with your employees to join your organization
                </p>
              </div>
            )}

            <button className="bg-[#20A4F3] text-white px-10 py-3 rounded-[30px] font-semibold hover:bg-[#1a8bd1] transition-colors"
              onClick={() => navigate("/")}
            >
              Let's Start!
            </button>

          </div>
        )}
      </motion.div>
    </div>
  );
}
