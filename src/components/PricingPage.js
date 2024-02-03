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
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition ease-in-out duration-150"
        >
          ← Back to Login
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center text-gray-900 mt-4">
          Pricing Plans
        </h1>
        <p className="mt-1 text-md text-gray-600">
          Choose the plan that fits you best.
        </p>
      </div>
      <div className="mt-6 mx-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-4 bg-white rounded-lg shadow-sm border max-w-sm mx-auto ${
              plan.highlighted
                ? "border-2 border-indigo-500"
                : "border border-gray-200"
            }`}
          >
            <h3
              className={`text-md leading-6 font-medium ${
                plan.highlighted ? "text-indigo-500" : "text-gray-900"
              }`}
            >
              {plan.name}
            </h3>
            <p className="mt-2 text-2xl font-bold">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="text-gray-500 text-sm">
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to={plan.link}
              className={`mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow text-sm font-medium text-white ${
                plan.highlighted
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-gray-700 hover:bg-gray-800"
              } transition ease-in-out duration-150`}
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
