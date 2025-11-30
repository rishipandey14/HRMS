import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utility/Config";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const [signinemail, setsigninEmail] = useState("test@gmail.com");
  const [signinpassword, setsigninPassword] = useState("Test@123");

  const [form, setForm] = useState(1);
  const [error, setError] = useState("");

  // Tab switcher for form view
  const switchToSigninForm = () => setForm(2);
  const switchToSignupForm = () => setForm(1);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    if (!signinemail.trim() || !signinpassword.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/auth/login",
        { email: signinemail, password: signinpassword },
        { withCredentials: true }
      );
      // Store token in localStorage
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !mobile.trim() ||
      !companyId.trim()
    ) {
      setError("Please fill all fields before signing up.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "/user/signup", 
        { name, email, password, mobile, companyCode: companyId }, 
        { withCredentials: true }
      );
      const user = res?.data?.data;
      // dispatch(addUser(user));
      // dispatch(showToast("Account created Successfully"));
      
      // Wait a bit for Redux to update before navigating
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    }
  };

  const validatePassword = (pwd) => {
    return pwd.length < 8 || pwd === email || !/[0-9!@#$%^&*]/.test(pwd);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setShowPasswordRules(validatePassword(value));
  };

  return (
    <div className="flex h-[100vh]">
      {/* Left Side - Image */}

      <div className="hidden md:flex h-screen w-[50%] items-center justify-center py-4 ">
        <div className="bg-[url(./imagelogo.jpg)] bg-cover bg-center w-[80%] h-full rounded-4xl flex flex-col justify-between p-4 mr-16">
          {/* Top Content */}
          <div className="flex flex-col items-center justify-center pt-6 text-center">
            <div className="text-white text-5xl md:text-5xl font-bold leading-tight">
              WELCOME TO TASKFLEET
            </div>
            <div className="text-white text-base md:text-2xl pt-2">
              Your Gateway to Effortless Management
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col items-center justify-center pb-6 text-center">
            <div className="text-white text-xl md:text-4xl font-semibold">
              Seamless Collaboration
            </div>
            <div className="text-white text-sm md:text-xl pt-4">
              Effortless work together with your
            </div>
            <div className="text-white text-sm md:text-xl pb-4">
              team in real time.
            </div>
            <div className="text-white text-xl md:text-3xl font-bold">...</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}

      <div className="hidden md:flex w-[50%] h-screen items-center justify-center p-6">
        {/*signup form */}
        {form === 1 && (
          <div className="w-full max-w-sm">
            {/* Logo */}
            <h1 className="text-[#26203B] text-2xl font-bold mb-6">
              TaskFleet
            </h1>

            {/* Tab Switcher */}
            <div className="flex mb-6 rounded-xl p-1 bg-gray-200">
              <button className="flex-1 py-2 text-xs text-white bg-[#20A4F3] rounded-xl">
                Sign Up
              </button>
              <button
                type="button"
                onClick={switchToSigninForm}
                className="flex-1 py-2 text-xs text-gray-600 rounded-xl hover:bg-gray-100 transition"
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <form className="space-y-2" onSubmit={handleSignup}>
              {/* Name */}
              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {/* Email */}
              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Email Id
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              {/* Password Rules */}
              {showPasswordRules && (
                <ul className="text-xs text-gray-500 pl-4 list-disc">
                  <li>Password Strength: Weak</li>
                  <li>Cannot contain your name or email address</li>
                  <li>At least 8 characters</li>
                  <li>Contains a number or symbol</li>
                </ul>
              )}

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter Password"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              {/* Company ID */}
              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Company ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Company ID"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                />
              </div>

              <div className="text-xs text-[#736e88] flex justify-end">
                Company?
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#20A4F3] text-white py-2 rounded hover:bg-blue-600 transition text-xs mt-4"
                onClick={handleSignup}
              >
                Create Account
              </button>

              {/* OR Divider */}
              <div className="my-4 text-center text-xs text-[#9C9AA5]">OR</div>

              {/* Social Buttons */}
              <div className="flex flex-row gap-3">
                <div className="flex-1 p-2 flex items-center justify-center border border-[#a192dd] rounded-xl hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1 p-2 flex items-center justify-center border border-[#a192dd] rounded-xl hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://img.icons8.com/?size=100&id=30840&format=png&color=000000"
                    alt="Apple"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1 p-2 flex items-center justify-center border border-[#a192dd] rounded-xl hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://img.icons8.com/color/48/windows-logo.png"
                    alt="Microsoft"
                    className="w-5 h-5"
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-center text-gray-600 mt-4">
                By signing up to create an account I accept Company's
                <br />
                <span className="text-black">
                  Terms of use & Privacy Policy
                </span>
              </p>
            </form>
          </div>
        )}

        {/* Sign In form*/}

        {form === 2 && (
          <div className="w-full max-w-sm">
            {/* Top Section: Shared */}
            <h1 className="text-[#26203B] text-2xl font-bold mb-6">
              TaskFleet
            </h1>
            <div className="flex mb-6 rounded-xl p-1 bg-gray-200">
              <button
                type="button"
                onClick={switchToSignupForm}
                className="flex-1 py-2 text-xs text-gray-600 hover:bg-gray-100 transition rounded-xl"
              >
                Sign Up
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-xs text-white bg-[#20A4F3] rounded-xl"
              >
                Sign In
              </button>
            </div>

            {/* Sign In Form */}
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Email Id
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={signinemail}
                  onChange={(e) => setsigninEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-xs text-[#26203B]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full h-[48px] px-3 py-2 border border-[#a192dd] rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={signinpassword}
                  onChange={(e) => setsigninPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-xs text-[#736e88] flex justify-end">
                Forgot Password?
              </div>

              <button
                type="submit"
                className="w-full bg-[#20A4F3] text-white py-2 rounded hover:bg-blue-600 transition text-xs mt-4"
                onClick={handleSignin}
              >
                Login
              </button>

              <div className="my-4 text-center text-xs text-[#9C9AA5]">OR</div>

              {/* Social Login Buttons */}
              <div className="flex flex-row gap-3">
                <div className="flex-1 p-2 flex items-center justify-center border border-[#a192dd] rounded-xl hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1 p-2 flex items-center justify-center border border-[#a192dd] rounded-xl hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://img.icons8.com/?size=100&id=30840&format=png&color=000000"
                    alt="Apple"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1 p-2 flex items-center justify-center border border-[#a192dd] rounded-xl hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://img.icons8.com/color/48/windows-logo.png"
                    alt="Microsoft"
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
