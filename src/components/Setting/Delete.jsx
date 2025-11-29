


import React from "react";

const Delete = () => {
    return (
        <div className="bg-white rounded-2xl  flex-1 w-full max-w-4xl p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Account</h2>

            <div className="bg-red-100  text-red-700 rounded-md p-4 mb-6">
                <p className="font-semibold flex items-center gap-2">
                    <span className="text-red-600 text-lg">⚠️</span>
                    Warning: This action cannot be undone
                </p>
                <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
                    <li>Permanently remove all your data</li>
                    <li>Cancel all active subscriptions</li>
                    <li>Remove you from all teams and projects</li>
                </ul>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm mb-2">
                    To confirm, type <strong>"delete my account"</strong> in the field below.
                </div>
                <input
                    type="text"
                    placeholder="delete my account"
                    className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all">
                    Delete account
                </button>
            </div>
        </div>
    );
};

export default Delete;
