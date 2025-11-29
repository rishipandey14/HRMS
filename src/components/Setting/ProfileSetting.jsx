import React from "react";

const ProfileSettings = () => {
  return (
    <div className="p-2 w-full min-h-screen bg-gray-50 ">

      <div className="max-w-4xl bg-gray-100 p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Profile Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your personal information and preferences</p>

        {/* Main Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6 mb-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <img
              src="https://api.dicebear.com/6.x/thumbs/svg?seed=admin"
              alt="Avatar"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Tanmay Pardhi</h2>
              <p className="text-sm text-gray-500">Product Manager</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Full Name</p>
              <div className="flex items-center gap-1">
                <span className="text-gray-800">Tanmay Pardhi</span>
                <button className="text-blue-500 text-xs hover:underline">✎</button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email Address</p>
              <div className="flex items-center gap-1">
                <span className="text-gray-800">tanmay@taskfleet.com</span>
                <button className="text-blue-500 text-xs hover:underline">✎</button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <div className="flex items-center gap-1">
                <span className="text-gray-800">+91 62661 62183</span>
                <button className="text-blue-500 text-xs hover:underline">✎</button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Job Title</p>
              <div className="flex items-center gap-1">
                <span className="text-gray-800">Product Manager</span>
                <button className="text-blue-500 text-xs hover:underline">✎</button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Card (Separate like image) */}
        <div className="bg-white p-6 rounded-xl shadow-md ">
          <h2 className="text-sm font-medium text-gray-800">Password</h2>
          <p className="text-sm text-gray-600">
            Ensure your account is using a strong password for security.
          </p>
          <button className="px-4 py-2 text-sm text-black  bg-white border border-gray-200 rounded-md">
            🔐 Change Password
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProfileSettings;




// import React from 'react'

// const ProfileSetting = () => {
//     return (
//         <div className="w-full p-2 min-h-screen bg-gray-50">

//             <div className="max-w-4xl">
//                 <h1>Profile setting</h1>
//                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, tenetur!</p>

//                 <div className="bg-blue-800 ">
//                     <div className="flex">
//                         <img src="" alt="bbbbbbbbb" />
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-800">Tanmay Pardhi</h2>
//                             <p className="text-sm text-gray-500">Product Manager</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6 bg-yellow-500 text-sm">
//                     <div >
//                         <p>Full name</p>
//                         <div className="flex">
//                             <h1>akash jain</h1>
//                             <button className="text-blue-500 text-xs hover:underline">✎</button>
//                         </div>
//                     </div>
//                     <div >
//                         <p>Full name</p>
//                         <div className="flex">
//                             <h1>akash jain</h1>
//                             <button className="text-blue-500 text-xs hover:underline">✎</button>
//                         </div>
//                     </div>
//                     <div >
//                         <p>Full name</p>
//                         <div className="flex">
//                             <h1>akash jain</h1>
//                             <button className="text-blue-500 text-xs hover:underline">✎</button>
//                         </div>
//                     </div>
//                     <div >
//                         <p>Full name</p>
//                         <div className="flex">
//                             <h1>akash jain</h1>
//                             <button className="text-blue-500 text-xs hover:underline">✎</button>
//                         </div>
//                     </div>
//                     <div />
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow-md mt-6">
//                     <h2 className="text-sm font-medium text-gray-800">Password</h2>
//                     <p className="text-sm text-gray-600">
//                         Ensure your account is using a strong password for security.
//                     </p>
//                     <button className="px-4 py-2 text-sm text-black bg-white border border-gray-200 rounded-md">
//                         🔐 Change Password
//                     </button>


//                 </div>

//             </div>
//         </div>
//     )
// }

// export default ProfileSetting
