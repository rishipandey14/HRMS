import React, { useState } from "react";

const Integrations = () => {
  const [toggles, setToggles] = useState({
    slack: true,
    google: false,
    github: false,
    jira: true,
    dropbox: false,
    teams: false,
    zoom: false,
    figma: false,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-2 w-full min-h-screen bg-gray-50 ">

      <div className="max-w-4xl bg-gray-100 p-4">


      {/* Page Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Integrations</h1>
      <p className="text-gray-500 mt-1">
        Connect TaskFleet with your favorite tools and services
      </p>

      {/* Featured Integrations */}
      <h2 className="mt-8 text-lg font-semibold text-gray-900">Featured Integrations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

        {/* Slack Card */}
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
          <div className="flex gap-4">
            <img src="/icons/slack.png" className="w-10 h-10" alt="Slack" />
            <div>
              <h3 className="font-semibold text-gray-900">Slack</h3>
              <p className="text-gray-500 text-sm">
                Get task notifications and updates in your Slack channels
              </p>
              <button className="mt-2 text-blue-500 text-sm">Configure</button>
            </div>
          </div>

          {/* Toggle */}
          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              checked={toggles.slack}
              onChange={() => handleToggle("slack")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>

        {/* Google Calendar */}
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
          <div className="flex gap-4">
            <img src="/icons/google.png" className="w-10 h-10" alt="Google" />
            <div>
              <h3 className="font-semibold text-gray-900">Google Calendar</h3>
              <p className="text-gray-500 text-sm">
                Sync project deadlines with your Google Calendar
              </p>
              <button className="mt-2 text-blue-500 text-sm">Connect</button>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              checked={toggles.google}
              onChange={() => handleToggle("google")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>

      </div>

      {/* All Integrations */}
      <h2 className="mt-10 text-lg font-semibold text-gray-900">All Integrations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">

        {/* Single Integration Box */}
        {[
          { id: "github", name: "GitHub", icon: "/icons/github.png" },
          { id: "jira", name: "Jira", icon: "/icons/jira.png" },
          { id: "dropbox", name: "Dropbox", icon: "/icons/dropbox.png" },
          { id: "teams", name: "Microsoft Teams", icon: "/icons/teams.png" },
          { id: "zoom", name: "Zoom", icon: "/icons/zoom.png" },
          { id: "figma", name: "Figma", icon: "/icons/figma.png" },
        ].map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <img src={item.icon} className="w-8 h-8" alt={item.name} />
              <p className="font-medium text-gray-900">{item.name}</p>
            </div>

            {/* Toggle */}
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={toggles[item.id]}
                onChange={() => handleToggle(item.id)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
              <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Integrations;
