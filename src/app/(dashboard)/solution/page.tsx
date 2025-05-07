"use client";

import withAuth from "@/hooks/with-auth";
// import useAuthRedirect from "@/hooks/useAuthRedirect";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SectionItem {
  id: number;
  section_key: string;
  content: string;
}

function Solution() {
  const [data, setData] = useState<SectionItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/solution");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching hero section:", err);
    }
  };

  const handleEdit = (item: SectionItem) => {
    setEditingId(item.id);
    setInputValue(item.content);
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/api/solution/${id}`, {
        content: inputValue,
      });
      toast.success("Cập nhật thành công!");
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Error updating content:", err);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Solution</h1>
      {data.map((item) => (
        <div
          key={item.id}
          className="border rounded p-4 bg-white shadow flex flex-col gap-2"
        >
          <span className="text-sm text-gray-500">{item.section_key}</span>
          {editingId === item.id ? (
            <>
              <textarea
                className="border p-2 rounded w-full"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                onClick={() => handleSave(item.id)}
                className="self-end px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              >
                Lưu
              </button>
            </>
          ) : (
            <div
              onClick={() => handleEdit(item)}
              className="cursor-pointer whitespace-pre-line"
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default withAuth(Solution);
