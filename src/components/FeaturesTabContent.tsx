import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Feature {
  id: number;
  name: string;
}

const FeaturesTabContent = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newFeature, setNewFeature] = useState<Feature>({ id: 0, name: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await api.get("/api/price_list/features");
        setFeatures(res.data);
      } catch (error) {
        console.error("Error fetching features:", error);
        toast.error("Lỗi khi tải các tính năng.");
      }
    };

    fetchFeatures();
  }, []);

  // Cập nhật tính năng
  const handleEdit = (feature: Feature) => {
    setIsEditing(true);
    setEditingFeature(feature);
  };

  const handleSave = async () => {
    if (editingFeature) {
      try {
        await api.put(
          `/api/price_list/features/${editingFeature.id}`,
          editingFeature
        );
        toast.success("Cập nhật tính năng thành công.");
        setIsEditing(false);
        setEditingFeature(null);
        // Fetch lại danh sách tính năng
        const res = await api.get("/api/price_list/features");
        setFeatures(res.data);
      } catch (error) {
        console.error("Error updating feature:", error);
        toast.error("Lỗi khi cập nhật tính năng.");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingFeature(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Feature
  ) => {
    if (editingFeature) {
      setEditingFeature({
        ...editingFeature,
        [field]: e.target.value,
      });
    }
  };

  // Thêm tính năng mới
  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleAddSave = async () => {
    try {
      await api.post("/api/price_list/features", newFeature); // Gửi yêu cầu thêm tính năng mới
      toast.success("Thêm tính năng thành công.");
      setIsAdding(false);
      setNewFeature({ id: 0, name: "" });
      // Fetch lại danh sách tính năng
      const res = await api.get("/api/price_list/features");
      setFeatures(res.data);
    } catch (error) {
      console.error("Error adding feature:", error);
      toast.error("Lỗi khi thêm tính năng.");
    }
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setNewFeature({ id: 0, name: "" });
  };

  // Xóa tính năng
  const handleDelete = async (id: number) => {
    if (featureToDelete) {
      try {
        await api.delete(`/api/price_list/features/${id}`); // Gửi yêu cầu xóa tính năng
        toast.success("Tính năng đã được xóa.");
        // Fetch lại danh sách tính năng
        const res = await api.get("/api/price_list/features");
        setFeatures(res.data);
      } catch (error) {
        console.error("Error deleting feature:", error);
        toast.error("Lỗi khi xóa tính năng.");
      } finally {
        setShowDeleteModal(false); // Đóng modal xác nhận xóa
        setFeatureToDelete(null); // Reset tính năng cần xóa
      }
    }
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (feature: Feature) => {
    setFeatureToDelete(feature); // Cập nhật tính năng cần xóa
    setShowDeleteModal(true); // Mở modal
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Danh sách Tính Năng</h2>
      <div className="mb-4">
        <Button
          onClick={handleAdd}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer"
        >
          Thêm Tính Năng
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-medium">{feature.name}</h3>
            <div className="mt-2 space-x-4">
              <Button
                onClick={() => handleEdit(feature)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                Chỉnh Sửa
              </Button>
              <Button
                onClick={() => openDeleteModal(feature)} // Mở modal xác nhận xóa
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Chỉnh Sửa */}
      {isEditing && editingFeature && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Chỉnh Sửa Tính Năng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Tên Tính Năng
                </label>
                <input
                  type="text"
                  value={editingFeature.name}
                  onChange={(e) => handleChange(e, "name")}
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

      {/* Modal Thêm Tính Năng */}
      {isAdding && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Thêm Tính Năng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Tên Tính Năng
                </label>
                <input
                  type="text"
                  value={newFeature.name}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, name: e.target.value })
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
      {showDeleteModal && featureToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Xác Nhận Xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa tính năng{" "}
              <strong>{featureToDelete.name}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <Button
                onClick={() => setShowDeleteModal(false)} // Đóng modal mà không xóa
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  featureToDelete && handleDelete(featureToDelete.id)
                } // Gọi hàm xóa
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

export default FeaturesTabContent;
