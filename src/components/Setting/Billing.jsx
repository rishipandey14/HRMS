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



import React from 'react'

const Billing = () => {
    return (
        <div className="bg-blue-800 w-full p-6 h-[100vh] ">
            <div className="max-w-4xl bg-amber-400">
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">Billing Information</h1>
                <p>manage yoyrjjfi kjfjnij4r kjrfnrj4</p>

                <div className="bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <div className="">
                            <p className="font-semibold">Current Plan</p>
                            <span className="inline-block text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full mt-1">Active</span>
                            <p className="text-sm text-gray-600 mt-1">$29/month • Billed monthly</p>
                            <p className="text-xs text-gray-500 mt-1">Next billing: January 15, 2024</p>
                        </div>
                        <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                            Upgrade to Enterprise
                        </button>
                    </div>
                </div>


                <div className="bg-white">
                    <p>patyemtvt mehodd</p>
                    <div className="flex">
                         
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-4 h-4 bg-indigo-600 rounded-sm" />

                                <span className="text-xs text-gray-400 ml-2">Expires 12/25</span>
                            </div>
                         
                        <button>updateee</button>
                    </div>
                </div>


                <div className="bg-black text-white">
                    <p>billing history</p>

                    <div className="space-y-7">
                        <div className="flex justify-between">
                            <span>Dec 15, 2023</span>
                            <span>Pro Plan - Monthly</span>
                            <span>$29.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Nov 15, 2023</span>
                            <span>Pro Plan - Monthly</span>
                            <span>$29.00</span>
                            </div>
                    </div>

                </div>



            </div>
        </div>
    )
}

export default Billing
