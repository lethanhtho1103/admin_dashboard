"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Feature {
  id: number;
  name: string;
}

interface PlanDetails {
  id: number;
  name: string;
  features: Feature[];
}

const PlanDetailsTabContent = () => {
  const [plans, setPlans] = useState<PlanDetails[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/api/price_list"); // API trả về toàn bộ gói và feature
        setPlans(res.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Không thể tải danh sách gói dịch vụ.");
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Chi tiết Gói Dịch Vụ</h2>

      {plans.map((plan) => (
        <div key={plan.id} className="border rounded-md p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Thêm
              </Button>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-1" />
                Sửa
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </Button>
            </div>
          </div>
          <ul className="list-disc list-inside ml-2 text-sm text-muted-foreground">
            {plan.features.length > 0 ? (
              plan.features.map((feature) => (
                <li key={feature.id}>{feature.name}</li>
              ))
            ) : (
              <li>Chưa có tính năng nào</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PlanDetailsTabContent;
