import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Plan {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const PlansTabContent = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false); // Để quản lý modal Thêm
  const [newPlan, setNewPlan] = useState<Plan>({
    id: 0,
    name: "",
    description: "",
    icon: "",
  }); // Thông tin gói mới
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal xác nhận xóa
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null); // Gói cần xóa

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/api/price_list/plans");
        setPlans(res.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Lỗi khi tải các gói dịch vụ.");
      }
    };

    fetchPlans();
  }, []);

  // Cập nhật gói dịch vụ
  const handleEdit = (plan: Plan) => {
    setIsEditing(true);
    setEditingPlan(plan);
  };

  const handleSave = async () => {
    if (editingPlan) {
      try {
        await api.put(`/api/price_list/plans/${editingPlan.id}`, editingPlan);
        toast.success("Cập nhật gói dịch vụ thành công.");
        setIsEditing(false);
        setEditingPlan(null);
        // Fetch lại danh sách gói dịch vụ
        const res = await api.get("/api/price_list/plans");
        setPlans(res.data);
      } catch (error) {
        console.error("Error updating plan:", error);
        toast.error("Lỗi khi cập nhật gói dịch vụ.");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPlan(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Plan
  ) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        [field]: e.target.value,
      });
    }
  };

  // Thêm gói dịch vụ mới
  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleAddSave = async () => {
    try {
      await api.post("/api/price_list/plans", newPlan); // Gửi yêu cầu thêm gói mới
      toast.success("Thêm gói dịch vụ thành công.");
      setIsAdding(false);
      setNewPlan({ id: 0, name: "", description: "", icon: "" }); // Reset thông tin
      // Fetch lại danh sách gói dịch vụ
      const res = await api.get("/api/price_list/plans");
      setPlans(res.data);
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error("Lỗi khi thêm gói dịch vụ.");
    }
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setNewPlan({ id: 0, name: "", description: "", icon: "" });
  };

  // Xóa gói dịch vụ
  const handleDelete = async (id: number) => {
    if (planToDelete) {
      try {
        await api.delete(`/api/price_list/plans/${id}`); // Gửi yêu cầu xóa gói dịch vụ
        toast.success("Gói dịch vụ đã được xóa.");
        // Fetch lại danh sách gói dịch vụ
        const res = await api.get("/api/price_list/plans");
        setPlans(res.data);
      } catch (error) {
        console.error("Error deleting plan:", error);
        toast.error("Lỗi khi xóa gói dịch vụ.");
      } finally {
        setShowDeleteModal(false); // Đóng modal xác nhận xóa
        setPlanToDelete(null); // Reset gói cần xóa
      }
    }
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (plan: Plan) => {
    setPlanToDelete(plan); // Cập nhật gói cần xóa
    setShowDeleteModal(true); // Mở modal
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Danh sách Gói Dịch Vụ</h2>
      <div className="mb-4">
        <Button
          onClick={handleAdd}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer"
        >
          Thêm Gói Dịch Vụ
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p>{plan.description}</p>
            <div className="mt-2 space-x-4">
              <Button
                onClick={() => handleEdit(plan)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                Chỉnh Sửa
              </Button>
              <Button
                onClick={() => openDeleteModal(plan)} // Mở modal xác nhận xóa
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Chỉnh Sửa */}
      {isEditing && editingPlan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Chỉnh Sửa Gói Dịch Vụ
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Tên Gói</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => handleChange(e, "name")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mô Tả</label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => handleChange(e, "description")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <Button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Gói Dịch Vụ */}
      {isAdding && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Thêm Gói Dịch Vụ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Tên Gói</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mô Tả</label>
                <input
                  type="text"
                  value={newPlan.description}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <Button
                onClick={handleAddCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {showDeleteModal && planToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Xác Nhận Xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa gói dịch vụ{" "}
              <strong>{planToDelete.name}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <Button
                onClick={() => setShowDeleteModal(false)} // Đóng modal mà không xóa
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={() => planToDelete && handleDelete(planToDelete.id)} // Gọi hàm xóa
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansTabContent;
