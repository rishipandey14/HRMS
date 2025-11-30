// import React from 'react';

// const Billing = () => {
//   return (
//     <div className="w-full p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-1">Subscription & Pricing</h2>
//       <p className="text-sm text-gray-500 mb-6">
//         Manage your subscription plan and billing information
//       </p>

//       {/* Current Plan */}
//       <div className="bg-gray-50 border rounded-md p-4 mb-6">
//         <div className="flex justify-between items-center mb-2">
//           <div>
//             <p className="font-semibold">Current Plan</p>
//             <span className="inline-block text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full mt-1">Active</span>
//             <p className="text-sm text-gray-600 mt-1">$29/month • Billed monthly</p>
//             <p className="text-xs text-gray-500 mt-1">Next billing: January 15, 2024</p>
//           </div>
//           <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
//             Upgrade to Enterprise
//           </button>
//         </div>
//       </div>

//       {/* Payment Method */}
//       <div className="bg-gray-50 border rounded-md p-4 mb-6">
//         <p className="font-semibold mb-1">Payment Method</p>
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <div className="w-4 h-4 bg-indigo-600 rounded-sm" />
//             **** **** **** 4242
//             <span className="text-xs text-gray-400 ml-2">Expires 12/25</span>
//           </div>
//           <button className="text-sm text-blue-600 hover:underline">Update</button>
//         </div>
//       </div>

//       {/* Billing History */}
//       <div className="bg-gray-50 border rounded-md p-4">
//         <p className="font-semibold mb-2">Billing History</p>
//         <div className="space-y-2 text-sm text-gray-700">
//           <div className="flex justify-between">
//             <span>Dec 15, 2023</span>
//             <span>Pro Plan - Monthly</span>
//             <span>$29.00</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Nov 15, 2023</span>
//             <span>Pro Plan - Monthly</span>
//             <span>$29.00</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Billing;



// import React from 'react'

// const Billing = () => {
//     return (
//         <div className="bg-blue-800 w-full p-6 h-[100vh] ">
//             <div className="max-w-4xl bg-amber-400">
//                 <h1 className="text-2xl font-semibold text-gray-800 mb-1">Billing Information</h1>
//                 <p>manage yoyrjjfi kjfjnij4r kjrfnrj4</p>

//                 <div className="bg-white">
//                     <div className="flex justify-between items-center mb-4">
//                         <div className="">
//                             <p className="font-semibold">Current Plan</p>
//                             <span className="inline-block text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full mt-1">Active</span>
//                             <p className="text-sm text-gray-600 mt-1">$29/month • Billed monthly</p>
//                             <p className="text-xs text-gray-500 mt-1">Next billing: January 15, 2024</p>
//                         </div>
//                         <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
//                             Upgrade to Enterprise
//                         </button>
//                     </div>
//                 </div>


//                 <div className="bg-white">
//                     <p>patyemtvt mehodd</p>
//                     <div className="flex">
                         
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <div className="w-4 h-4 bg-indigo-600 rounded-sm" />

//                                 <span className="text-xs text-gray-400 ml-2">Expires 12/25</span>
//                             </div>
                         
//                         <button>updateee</button>
//                     </div>
//                 </div>


//                 <div className="bg-black text-white">
//                     <p>billing history</p>

//                     <div className="space-y-7">
//                         <div className="flex justify-between">
//                             <span>Dec 15, 2023</span>
//                             <span>Pro Plan - Monthly</span>
//                             <span>$29.00</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>Nov 15, 2023</span>
//                             <span>Pro Plan - Monthly</span>
//                             <span>$29.00</span>
//                             </div>
//                     </div>

//                 </div>



//             </div>
//         </div>
//     )
// }

//export default Billing 

import React from "react";

const Subscription = () => {
  return (
    <div className="p-2 w-full min-h-screen bg-gray-50 ">

      <div className="max-w-4xl bg-gray-100 p-4">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Subscription & Pricing
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your subscription plan and billing information
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white shadow-sm rounded-2xl p-6 mt-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3">
          <div>
            <p className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              Pro Plan
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </p>
            <p className="text-gray-600 mt-1">$29/month • Billed monthly</p>
            <p className="text-gray-400 text-sm mt-1">
              Next billing: January 15, 2024
            </p>
          </div>

          <button className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg">
            Upgrade to Enterprise
          </button>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-white shadow-sm rounded-2xl p-6 mt-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>

        <div className="flex items-center justify-between mt-4">
          {/* Card Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded-md bg-gradient-to-r from-purple-500 to-blue-500"></div>

            <div>
              <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
              <p className="text-gray-500 text-sm">Expires 12/25</p>
            </div>
          </div>

          <button className="border border-blue-400 text-blue-500 px-4 py-1 rounded-lg hover:bg-blue-50">
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white shadow-sm rounded-2xl p-6 mt-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Date</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-3 text-gray-800">Dec 15, 2023</td>
                <td className="py-3 text-gray-600">Pro Plan – Monthly</td>
                <td className="py-3 text-gray-800 text-right">$29.00</td>
              </tr>

              <tr>
                <td className="py-3 text-gray-800">Nov 15, 2023</td>
                <td className="py-3 text-gray-600">Pro Plan – Monthly</td>
                <td className="py-3 text-gray-800 text-right">$29.00</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Subscription;

