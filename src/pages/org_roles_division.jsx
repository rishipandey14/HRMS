"use client"

import { useState } from "react"
import { CheckCircle2, User } from "lucide-react"

export default function Plan({ onPackageSelect } = {}) {
  const [isAnnual, setIsAnnual] = useState(false)

  const Role_structure = [
    {
      id: "basic",
      name: "Basic",
      description: "Best for Early Start-Ups.",
      monthlyPrice: 0,
      originalMonthlyPrice: 800,
      annualPrice: 0,
      originalAnnualPrice: 9600, // 800 * 12
      features: [
        "Intern",
        "Executive",
        "Team Leader",
        "Manager",
        "C-Level (CTO, CEO)",   
      ],
      isCurrent: true,
      isSuggested: false,
      bgColorClass: "bg-[#4FC3F7]",
      textColorClass: "text-gray-900",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For Mid level teams & corporations.",
      monthlyPrice: 1199,
      originalMonthlyPrice: 1499,
      annualPrice: 14000,
      originalAnnualPrice: 1499 * 12,
      features: [
        "Intern",
        "Executive",
        "Team Leader",
        "Manager",
        "Senior Manager",
        "Director",
        "C-Level",
        "Chairman",
      ],
      isCurrent: false,
      isSuggested: true,
      bgColorClass: "bg-white",
      textColorClass: "text-gray-900",
    },
    {
      id: "business",
      name: "Business",
      description: "For large teams & corporations.",
      monthlyPrice: 2400,
      originalMonthlyPrice: 3000,
      annualPrice: 28000,
      originalAnnualPrice: 3000 * 12,
      features: [
        "Intern",
        "Executive",
        "Team Leader",
        "Supervisor",
        "Manager",
        "Senior Manager",
        "Director",
        "VP",
        "C-Level",
        "Managing Director (MD)",
        "Board",
        "Chairman",
      ],
      isCurrent: false,
      isSuggested: false,
      bgColorClass: "bg-white",
      textColorClass: "text-gray-900",
    },
  ]

  const handleSelectPackage = (role) => {
    onPackageSelect?.({
      packageId: role.id,
      packageName: role.name,
      billingCycle: isAnnual ? "annual" : "monthly",
      price: isAnnual ? role.annualPrice : role.monthlyPrice,
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transparent-scrollbar">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
          • OUR PLANS
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontStyle: 'normal', fontSize: '32px', lineHeight: '64px', letterSpacing: '-2%' }}>
          Plans for Your Need
        </h1>

        <p className="text-lg text-gray-600">
          Select from best plan, ensuring a perfect match. Need more or less? Customize your subscription for a seamless
          fit!
        </p>
        
        <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1" role="group">
          <button
            className={`px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              !isAnnual ? "bg-blue-500 text-white shadow" : "bg-transparent text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              isAnnual ? "bg-blue-500 text-white shadow" : "bg-transparent text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setIsAnnual(true)}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Role_structure.map((role) => (
          <div key={role.id} className={`relative p-8 rounded-xl shadow-lg flex flex-col ${role.bgColorClass}`}
            style={{ fontFamily: 'Switzer, sans-serif', fontWeight: 400, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0' }}>
            
            {role.isSuggested && (
              <div className="absolute top-4 right-4 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                #Suggested
              </div>
            )}
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-gray-900 mb-4">
              <User className="w-6 h-6" />
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 ${role.textColorClass}`}>{role.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{role.description}</p>

            <div className="flex flex-col items-center sm:flex-row sm:items-baseline mb-6 min-w-0 w-full flex-wrap sm:flex-nowrap">
              <span className={`text-4xl sm:text-5xl font-extrabold ${role.textColorClass} flex-shrink`}>
                ₹{isAnnual ? role.annualPrice : role.monthlyPrice}
              </span>
              {role.originalMonthlyPrice > 0 && (
                <span className="ml-2 text-lg text-gray-500 line-through flex-shrink">
                  ₹{isAnnual ? role.originalAnnualPrice : role.originalMonthlyPrice}
                </span>
              )}
              <span className="ml-0 sm:ml-1 text-gray-500 whitespace-nowrap">{isAnnual ? "/ year" : "/ month"}</span>
            </div>

            {role.isCurrent ? (
              <button
                onClick={() => handleSelectPackage(role)}
                className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 hover:opacity-90 cursor-pointer transition"
              >
                Currently
              </button>
            ) : (
              <button
                onClick={() => handleSelectPackage(role)}
                className="w-full border border-gray-300 text-gray-900 py-3 rounded-md font-semibold hover:bg-gray-100 bg-transparent cursor-pointer transition"
              >
                Upgrade
              </button>
            )}

            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className={`text-lg font-semibold mb-4 ${role.textColorClass}`}>Features</h3>
              <ul className="space-y-3">
                {role.features.map((feature, index) => (
                  <li key={index} className={`flex items-center ${role.textColorClass}`}>
                    <CheckCircle2 className="w-5 h-5 text-black mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
