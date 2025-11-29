 import React, { useState } from 'react'
 
import { User, CreditCard, Puzzle, ShieldCheck, Trash2 } from "lucide-react";
import ProfileSetting from './ProfileSetting';
import Delete from './Delete';
import Billing from './Billing';

const Setting = () => {
  const [activetab, setactivetab] = useState("profile");

  const menuitems = [
    { key: "profile", label: "Profile Setting", icon: User },
    { key: "billing", label: "Billing", icon: CreditCard },
    { key: "integrations", label: "Integrations", icon: Puzzle },
    { key: "security", label: "Security", icon: ShieldCheck },
    { key: "delete", label: "Delete Account", danger: true, icon: Trash2 },
  ];

  return (
    <div className='flex w-full'>
      <aside className='w-64 bg-white px-5 py-9'>
        <h2 className="text-xl font-semibold mb-6">Settings</h2>
        
        <ul className="space-y-1">
          {menuitems.map(({ label, icon: Icon, key, danger }) => (
            <li key={key}>
              <button
                onClick={() => setactivetab(key)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-left transition-all ${
                  activetab === key
                    ? "bg-blue-100 text-blue-700"
                    : danger
                    ? "text-red-500 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className='flex-1 p-6 bg-gray-100 min-h-[calc(100vh-80px)]'>
        {activetab === "profile" && <ProfileSetting />}
        {activetab === "delete" && <Delete />}
        {activetab === "billing" && <Billing />}
      </main>
    </div>
  );
};

export default Setting;