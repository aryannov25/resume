import React from "react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9/month",
      features: ["Access to basic features", "5 projects", "Community support"],
      cta: "Get Started",
      link: "/signup/basic",
    },
    {
      name: "Pro",
      price: "$29/month",
      features: [
        "All Basic features",
        "Unlimited projects",
        "Priority support",
        "Advanced analytics",
      ],
      cta: "Try Pro",
      link: "/signup/pro",
      highlighted: true,
    },
    {
      name: "Premium",
      price: "$59/month",
      features: [
        "All Pro features",
        "Dedicated support",
        "Custom integrations",
        "Team management",
      ],
      cta: "Go Premium",
      link: "/signup/premium",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 w-full flex justify-start items-center">
        <Link
          to="/login"
          className="text-blue-500 hover:text-blue-700 font-medium py-2 px-4 rounded"
        >
          ← Back to Login
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center text-gray-900 mt-4">
          Pricing Plans
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Choose the plan that's right for you.
        </p>
      </div>
      <div className="mt-10 m-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-6 bg-white rounded-lg shadow-sm ${
              plan.highlighted
                ? "border-2 border-indigo-600"
                : "border border-gray-200"
            }`}
          >
            <h3
              className={`text-lg leading-6 font-medium ${
                plan.highlighted ? "text-indigo-600" : "text-gray-900"
              }`}
            >
              {plan.name}
            </h3>
            <p className="mt-4 text-4xl font-extrabold">{plan.price}</p>
            <ul className="mt-6 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="text-gray-500">
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to={plan.link}
              className={`mt-8 w-full flex items-center justify-center px-5 py-3 border border-transparent rounded-md shadow text-base font-medium text-white ${
                plan.highlighted
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
