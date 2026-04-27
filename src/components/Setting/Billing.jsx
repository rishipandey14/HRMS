import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSubscriptionOverview } from "../../utility/subscriptionApi";

const formatDate = (value) => {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Subscription = () => {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please sign in to view billing details.");
          return;
        }

        const data = await fetchSubscriptionOverview(token);
        setSubscriptionData(data);
      } catch (requestError) {
        setError(requestError?.response?.data?.msg || requestError?.message || "Failed to load billing details");
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const subscription = subscriptionData?.subscription || null;
  const plan = subscription?.plan || null;
  const historyRows = useMemo(() => {
    if (!subscription) {
      return [];
    }

    return [
      {
        date: formatDate(subscription.startsAt),
        description: `${plan?.name || "Basic"} plan activated`,
        amount: plan?.price ? `₹${Number(plan.price).toLocaleString('en-IN')}` : "₹0.00",
      },
      {
        date: formatDate(subscription.endsAt),
        description: subscription.isExpired ? `${plan?.name || "Basic"} plan expired` : `${plan?.name || "Basic"} plan renewal`,
        amount: plan?.price ? `₹${Number(plan.price).toLocaleString('en-IN')}` : "₹0.00",
      },
    ];
  }, [subscription, plan]);

  return (
    <div className="p-2 w-full min-h-screen bg-gray-50 ">
      <div className="max-w-4xl bg-gray-100 p-4">

      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Subscription & Pricing
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your subscription plan and billing information
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-2xl p-6 mt-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3">
          <div>
            <p className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {loading ? "Loading plan..." : (plan?.name || "Basic Plan")}
              <span className={`text-xs px-2 py-1 rounded-full ${subscription?.isExpired ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                {subscription?.isExpired ? "Expired" : "Active"}
              </span>
            </p>
            <p className="text-gray-600 mt-1">
              {plan ? `₹${Number(plan.price || 0).toLocaleString('en-IN')}/month • Billed monthly` : "Trial access • Billed monthly"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {subscription?.isExpired ? `Expired on ${formatDate(subscription.endsAt)}` : `Next billing: ${formatDate(subscription?.endsAt)}`}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Employees: {subscription?.usage?.activeEmployees ?? 0}/{subscription?.limits?.maxEmployees ?? 0} • Projects: {subscription?.usage?.projects ?? 0}/{subscription?.limits?.maxProjects ?? 0}
            </p>
          </div>

          <button
            className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
            onClick={() => navigate("/plan")}
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-6 mt-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded-md bg-gradient-to-r from-purple-500 to-blue-500"></div>

            <div>
              <p className="font-medium text-gray-800">Billing handled in-app</p>
              <p className="text-gray-500 text-sm">Select Standard or Premium to activate the next billing cycle</p>
            </div>
          </div>

          <button className="border border-blue-400 text-blue-500 px-4 py-1 rounded-lg hover:bg-blue-50" onClick={() => navigate("/plan")}>
            Update
          </button>
        </div>
      </div>

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
              {historyRows.length > 0 ? historyRows.map((row, index) => (
                <tr key={row.description} className={index === 0 ? "border-b" : ""}>
                  <td className="py-3 text-gray-800">{row.date}</td>
                  <td className="py-3 text-gray-600">{row.description}</td>
                  <td className="py-3 text-gray-800 text-right">{row.amount}</td>
                </tr>
              )) : (
                <tr>
                  <td className="py-3 text-gray-800">--</td>
                  <td className="py-3 text-gray-600">No billing records yet</td>
                  <td className="py-3 text-gray-800 text-right">--</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Subscription;