"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const openUpload = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));

  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#E8EDFF] p-4 font-inter">
      
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

            {/* FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
              className="space-y-6 max-w-3xl mx-auto"
            >
              {/* Company Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter Company Name"
                  className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3]"
                />
              </div>

              {/* Company Email */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Company Email *
                </label>
                <input
                  type="email"
                  placeholder="Enter Company Email"
                  className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3]"
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
                    placeholder="Enter Password"
                    className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Re-Enter Password"
                    className="w-full border border-gray-300 rounded-[30px] px-5 py-3 focus:ring-2 focus:ring-[#20A4F3]"
                  />
                </div>
              </div>

              {/* Company Type */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Company Type *
                </label>

                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-[30px] px-5 py-3 appearance-none focus:ring-2 focus:ring-[#20A4F3]">
                    <option>Select Company Type</option>
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Manufacturing</option>
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
                  rows={3}
                  placeholder="Enter Company Address"
                  className="w-full border border-gray-300 rounded-[22px] px-5 py-3 resize-none focus:ring-2 focus:ring-[#20A4F3]"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-gray-600">
                  Get exciting offers on mail
                </span>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <button className="bg-[#20A4F3] text-white font-semibold px-12 py-3 rounded-[30px]">
                  Continue
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

            <p className="text-gray-500 text-center max-w-lg mb-10">
              Welcome aboard! Start your success journey with TaskFleet!
            </p>

            <button className="bg-[#20A4F3] text-white px-10 py-3 rounded-[30px] font-semibold"
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
