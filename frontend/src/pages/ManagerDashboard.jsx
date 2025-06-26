import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

function ManagerDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);

  // 🔐 Helper to decode JWT
  const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    const managerId = user?.sub;

    if (!managerId) {
      console.warn("Manager ID not found in token.");
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/feedback/manager?manager_id=${managerId}`
        );
        setFeedbacks(response.data);

        // 🧠 Compute sentiment summary
        const sentimentSummary = {
          positive: 0,
          neutral: 0,
          negative: 0,
        };

        response.data.forEach((fb) => {
          if (sentimentSummary[fb.sentiment] !== undefined) {
            sentimentSummary[fb.sentiment]++;
          }
        });

        setSentimentData([
          { name: "Positive", value: sentimentSummary.positive },
          { name: "Neutral", value: sentimentSummary.neutral },
          { name: "Negative", value: sentimentSummary.negative },
        ]);
      } catch (error) {
        console.error("Failed to fetch feedbacks", error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-xl font-semibold">Total Feedback Submitted</h2>
        <p className="text-3xl mt-2 text-blue-600">{feedbacks.length}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Sentiment Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sentimentData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ManagerDashboard;
