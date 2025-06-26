// src/pages/SubmitFeedback.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";

const SubmitFeedback = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    strengths: "",
    improvements: "",
    sentiment: "neutral",
    tags: "",
  });

  const manager_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/auth/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim()),
      };
      await axios.post(`/feedback?manager_id=${manager_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Feedback submitted!");
      setForm({
        employee_id: "",
        strengths: "",
        improvements: "",
        sentiment: "neutral",
        tags: "",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Dropdown */}
        <div>
          <label className="block font-medium mb-1">Employee</label>
          <select
            required
            className="w-full border rounded p-2"
            value={form.employee_id}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.id.slice(-5)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Strengths</label>
          <input
            type="text"
            value={form.strengths}
            onChange={(e) => setForm({ ...form, strengths: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Improvements</label>
          <input
            type="text"
            value={form.improvements}
            onChange={(e) => setForm({ ...form, improvements: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sentiment</label>
          <select
            value={form.sentiment}
            onChange={(e) => setForm({ ...form, sentiment: e.target.value })}
            className="w-full border rounded p-2"
          >
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default SubmitFeedback;
