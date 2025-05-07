// components/PriceList.tsx
"use client";
import FeaturesTabContent from "@/components/FeaturesTabContent";
import PlanDetailsTabContent from "@/components/PlanDetailsTabContent";
import PlansTabContent from "@/components/PlansTabContent";
import React, { useState } from "react";

const PriceList = () => {
  const [activeTab, setActiveTab] = useState<"plans" | "features" | "details">(
    "plans"
  );

  return (
    <div className="w-full p-4">
      {/* Tabs Section */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "plans"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          } hover:bg-blue-400 hover:text-white transition-colors`}
          onClick={() => setActiveTab("plans")}
        >
          Gói Dịch Vụ
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "features"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          } hover:bg-blue-400 hover:text-white transition-colors`}
          onClick={() => setActiveTab("features")}
        >
          Tính Năng
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "details"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          } hover:bg-blue-400 hover:text-white transition-colors`}
          onClick={() => setActiveTab("details")}
        >
          Chi Tiết
        </button>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        {activeTab === "plans" && <PlansTabContent />}
        {activeTab === "features" && <FeaturesTabContent />}
        {activeTab === "details" && <PlanDetailsTabContent />}{" "}
        {/* Example planId */}
      </div>
    </div>
  );
};

export default PriceList;
