import React from "react";
import { CheckCircle, Monitor, Smartphone, LogOut } from "lucide-react";

const SecuritySettings = () => {
  return (
    <div className="p-2 w-full min-h-screen bg-gray-50 ">

      <div className="max-w-4xl bg-gray-100 p-4">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Security Settings</h1>

      {/* CARD CONTAINER */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-10">

        {/* PASSWORD */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Password</h2>
            <p className="text-gray-500 text-sm">
              Update your password regularly to keep your account secure.
            </p>
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Change Password
          </button>
        </div>

        {/* TWO-FACTOR AUTH */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
            <p className="text-gray-500 text-sm">
              Add an extra layer of security to your account by verifying both your password and a code.
            </p>

            {/* SUCCESS MESSAGE BOX */}
            <div className="mt-4 flex items-start gap-3 bg-green-50 border border-green-200 p-4 rounded-lg">
              <CheckCircle className="text-green-600 w-5 h-5 mt-1" />
              <div>
                <p className="text-green-700 font-medium text-sm">
                  Two-factor authentication is currently enabled on your account.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Last verified: May 15, 2023
                </p>
              </div>
            </div>

            {/* Recovery Codes */}
            <button className="mt-3 text-blue-600 text-sm hover:underline">
              View codes
            </button>
          </div>

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Disable 2FA
          </button>
        </div>

        {/* ACTIVE SESSIONS */}
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>

            <button className="text-blue-600 text-sm hover:underline">
              Sign out all other sessions
            </button>
          </div>

          {/* SESSIONS LIST */}
          <div className="mt-4 space-y-4">

            {/* SESSION CARD */}
            <div className="p-4 border rounded-xl bg-white shadow-sm flex justify-between items-center">
              <div className="flex items-start gap-3">
                <Monitor className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">MacBook Pro – Chrome</p>
                  <p className="text-xs text-gray-500">San Francisco, CA, USA • 192.168.1.14</p>
                  <p className="text-xs text-gray-400 mt-1">Last active: just now</p>
                </div>
              </div>

              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Current
              </span>
            </div>

            {/* iPhone Session */}
            <div className="p-4 border rounded-xl bg-white shadow-sm flex justify-between items-center">
              <div className="flex items-start gap-3">
                <Smartphone className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">iPhone 13 – Safari</p>
                  <p className="text-xs text-gray-500">New York, NY, USA • 198.51.100.42</p>
                  <p className="text-xs text-gray-400 mt-1">Last active: 2 hours ago</p>
                </div>
              </div>

              <button className="text-red-500 text-sm hover:underline">Revoke</button>
            </div>

            {/* iPad Session */}
            <div className="p-4 border rounded-xl bg-white shadow-sm flex justify-between items-center">
              <div className="flex items-start gap-3">
                <Monitor className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">iPad – Chrome</p>
                  <p className="text-xs text-gray-500">Chicago, IL, USA • 203.0.113.5</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last active: Yesterday at 3:42 PM
                  </p>
                </div>
              </div>

              <button className="text-red-500 text-sm hover:underline">Revoke</button>
            </div>

          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default SecuritySettings;
