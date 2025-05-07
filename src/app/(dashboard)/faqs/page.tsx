"use client";

import withAuth from "@/hooks/with-auth";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

function Faqs() {
  const [data, setData] = useState<FaqItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState<string>("");
  const [editAnswer, setEditAnswer] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/faqs");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setEditQuestion(item.question);
    setEditAnswer(item.answer);
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/api/faqs/${id}`, {
        question: editQuestion,
        answer: editAnswer,
      });
      toast.success("Cập nhật thành công!");
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Error updating FAQ:", err);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Câu hỏi thường gặp</h1>
      {data.map((item) => (
        <div
          key={item.id}
          className="border rounded p-4 bg-white shadow flex flex-col gap-2"
        >
          {editingId === item.id ? (
            <>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
              />
              <textarea
                className="border p-2 rounded w-full"
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
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
              className="cursor-pointer space-y-1"
            >
              <h2 className="font-semibold">{item.question}</h2>
              <p className="whitespace-pre-line">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default withAuth(Faqs);
