"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, User } from "lucide-react"
import { fetchSubscriptionOverview, upgradeSubscriptionPlan } from "../utility/subscriptionApi"

const PLAN_COPY = {
  basic: {
    description: "Best for new organizations getting started.",
    features: ["7-day trial access", "Core team workspace", "Task management", "Calendar integration", "File storage", "Reporting and analytics"],
    bgColorClass: "bg-[#4FC3F7]",
    textColorClass: "text-gray-900",
  },
  standard: {
    description: "Best for growing teams that need more headroom.",
    features: ["Role-based access", "Project controls", "Team collaboration", "Advanced reports", "Priority onboarding", "Workflow visibility"],
    bgColorClass: "bg-white",
    textColorClass: "text-gray-900",
  },
  premium: {
    description: "Best for larger teams with higher limits.",
    features: ["Expanded employee capacity", "Expanded project capacity", "Advanced reporting", "Priority support", "Custom permissions", "Enterprise-ready controls"],
    bgColorClass: "bg-white",
    textColorClass: "text-gray-900",
  },
}

const FALLBACK_PLANS = [
  {
    id: "basic",
    code: "basic",
    name: "Basic",
    monthlyPrice: 0,
    annualPrice: 0,
    limits: { maxEmployees: 5, maxProjects: 3 },
    bgColorClass: PLAN_COPY.basic.bgColorClass,
    textColorClass: PLAN_COPY.basic.textColorClass,
  },
  {
    id: "standard",
    code: "standard",
    name: "Standard",
    monthlyPrice: 499,
    annualPrice: 5988,
    limits: { maxEmployees: 25, maxProjects: 12 },
    bgColorClass: PLAN_COPY.standard.bgColorClass,
    textColorClass: PLAN_COPY.standard.textColorClass,
  },
  {
    id: "premium",
    code: "premium",
    name: "Premium",
    monthlyPrice: 999,
    annualPrice: 11988,
    limits: { maxEmployees: 100, maxProjects: 50 },
    bgColorClass: PLAN_COPY.premium.bgColorClass,
    textColorClass: PLAN_COPY.premium.textColorClass,
  },
]

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

export default function Plan() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState("")

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Please sign in to view subscription plans.")
          return
        }

        const data = await fetchSubscriptionOverview(token)
        setSubscriptionData(data)
      } catch (requestError) {
        setError(requestError?.response?.data?.msg || requestError?.message || "Failed to load plans")
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [])

  const currentSubscription = subscriptionData?.subscription || null
  const currentPlanCode = currentSubscription?.plan?.code || currentSubscription?.planId || "basic"

  const pricingPlans = useMemo(() => {
    const sourcePlans = subscriptionData?.plans?.length ? subscriptionData.plans : FALLBACK_PLANS

    return sourcePlans.map((plan) => {
      const copy = PLAN_COPY[plan.code] || PLAN_COPY.basic
      const monthlyPrice = plan.monthlyPrice ?? plan.price ?? Math.round((plan.priceCents || 0) / 100)
      const annualPrice = plan.annualPrice ?? monthlyPrice * 12
      const isExpiredCurrentPlan = Boolean(currentSubscription?.isExpired && currentPlanCode === plan.code)
      const isCurrent = !isExpiredCurrentPlan && currentPlanCode === plan.code

      return {
        ...plan,
        monthlyPrice,
        annualPrice,
        description: copy.description,
        features: [
          `${plan.limits?.maxEmployees || 0} employees included`,
          `${plan.limits?.maxProjects || 0} projects included`,
          ...copy.features,
        ],
        isCurrent,
        isExpiredCurrentPlan,
        isSuggested: plan.code === "standard",
        bgColorClass: copy.bgColorClass,
        textColorClass: copy.textColorClass,
      }
    })
  }, [subscriptionData, currentPlanCode, currentSubscription?.isExpired])

  const handleUpgrade = async (planId) => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please sign in to manage your subscription.")
      return
    }

    try {
      setActionLoading(planId)
      const data = await upgradeSubscriptionPlan(token, planId)
      setSubscriptionData((prev) => ({
        ...(prev || {}),
        subscription: data.subscription || prev?.subscription || null,
      }))
      setError("")
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || requestError?.message || "Failed to update plan")
    } finally {
      setActionLoading("")
    }
  }

  const summaryText = currentSubscription
    ? `${currentSubscription.plan?.name || "Basic"} plan is ${currentSubscription.isExpired ? "expired" : "active"}`
    : "Loading subscription..."

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

        <p className="text-sm text-gray-500">{summaryText}</p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Loading plan details...
          </div>
        ) : (
          pricingPlans.map((plan) => (
            <div key={plan.id} className={`relative p-8 rounded-xl shadow-lg flex flex-col ${plan.bgColorClass}`}
              style={{ fontFamily: 'Switzer, sans-serif', fontWeight: 400, fontStyle: 'normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0' }}>

              {plan.isSuggested && (
                <div className="absolute top-4 right-4 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                  #Suggested
                </div>
              )}

              {plan.isExpiredCurrentPlan && (
                <div className="absolute top-4 left-4 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Expired
                </div>
              )}

              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-gray-900 mb-4">
                <User className="w-6 h-6" />
              </div>

              <h2 className={`text-2xl font-bold mb-2 ${plan.textColorClass}`}>{plan.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

              <div className="flex flex-col items-center sm:flex-row sm:items-baseline mb-6 min-w-0 w-full flex-wrap sm:flex-nowrap">
                <span className={`text-4xl sm:text-5xl font-extrabold ${plan.textColorClass} flex-shrink`}>
                  {formatCurrency(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                </span>
                <span className="ml-0 sm:ml-1 text-gray-500 whitespace-nowrap">{isAnnual ? "/ year" : "/ month"}</span>
              </div>

              {plan.isCurrent ? (
                <button className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 hover:opacity-90 cursor-pointer transition">
                  Currently
                </button>
              ) : plan.code === "basic" ? (
                <button className="w-full bg-gray-200 text-gray-600 py-3 rounded-md font-semibold cursor-not-allowed transition" disabled>
                  {plan.isExpiredCurrentPlan ? "Expired" : "Included"}
                </button>
              ) : (
                <button
                  className="w-full border border-gray-300 text-gray-900 py-3 rounded-md font-semibold hover:bg-gray-100 bg-transparent cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={actionLoading === plan.id}
                >
                  {actionLoading === plan.id ? "Updating..." : "Upgrade"}
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
          ))
        )}
      </div>
    </div>
  )
}
