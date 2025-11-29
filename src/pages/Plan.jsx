"use client"

import { useState } from "react"
import { CheckCircle2, User } from "lucide-react"

export default function Plan() {
  const [isAnnual, setIsAnnual] = useState(false)

  const pricingPlans = [
    {
      id: "basic",
      name: "Basic",
      description: "Best for personal use.",
      monthlyPrice: 0,
      originalMonthlyPrice: 800,
      annualPrice: 0,
      originalAnnualPrice: 9600, // 800 * 12
      features: [
        "Employee directory",
        "Task management",
        "Calendar integration",
        "File storage",
        "Communication tools",
        "Reporting and analytics",   
      ],
      isCurrent: true,
      isSuggested: false,
      bgColorClass: "bg-[#4FC3F7]",
      textColorClass: "text-gray-900",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large teams & corporations.",
      monthlyPrice: 1199,
      originalMonthlyPrice: 1499,
      annualPrice: 14000,
      originalAnnualPrice: 1499 * 12,
      features: [
        "Advanced employee directory",
        "Project management",
        "Resource scheduling",
        "Version control",
        "Team collaboration",
        "Advanced analytics",
      ],
      isCurrent: false,
      isSuggested: true,
      bgColorClass: "bg-white",
      textColorClass: "text-gray-900",
    },
    {
      id: "business",
      name: "Business",
      description: "Best for business owners.",
      monthlyPrice: 2400,
      originalMonthlyPrice: 3000,
      annualPrice: 28000,
      originalAnnualPrice: 3000 * 12,
      features: [
        "Customizable employee directory",
        "Client project management",
        "Client meeting schedule",
        "Compliance tracking",
        "Client communication",
        "Create custom reports tailored",
      ],
      isCurrent: false,
      isSuggested: false,
      bgColorClass: "bg-white",
      textColorClass: "text-gray-900",
    },
  ]

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
        {pricingPlans.map((plan) => (
          <div key={plan.id} className={`relative p-8 rounded-xl shadow-lg flex flex-col ${plan.bgColorClass}`}
            style={{ fontFamily: 'Switzer, sans-serif', fontWeight: 400, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0' }}>
            
            {plan.isSuggested && (
              <div className="absolute top-4 right-4 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                #Suggested
              </div>
            )}
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-gray-900 mb-4">
              <User className="w-6 h-6" />
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 ${plan.textColorClass}`}>{plan.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

            <div className="flex flex-col items-center sm:flex-row sm:items-baseline mb-6 min-w-0 w-full flex-wrap sm:flex-nowrap">
              <span className={`text-4xl sm:text-5xl font-extrabold ${plan.textColorClass} flex-shrink`}>
                ₹{isAnnual ? plan.annualPrice : plan.monthlyPrice}
              </span>
              {plan.originalMonthlyPrice > 0 && (
                <span className="ml-2 text-lg text-gray-500 line-through flex-shrink">
                  ₹{isAnnual ? plan.originalAnnualPrice : plan.originalMonthlyPrice}
                </span>
              )}
              <span className="ml-0 sm:ml-1 text-gray-500 whitespace-nowrap">{isAnnual ? "/ year" : "/ month"}</span>
            </div>

            {plan.isCurrent ? (
              <button className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 hover:opacity-90 cursor-pointer transition">
                Currently
              </button>
            ) : (
              <button className="w-full border border-gray-300 text-gray-900 py-3 rounded-md font-semibold hover:bg-gray-100 bg-transparent cursor-pointer transition">
                Upgrade
              </button>
            )}

            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className={`text-lg font-semibold mb-4 ${plan.textColorClass}`}>Features</h3>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className={`flex items-center ${plan.textColorClass}`}>
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
