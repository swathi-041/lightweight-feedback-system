// src/pages/FeedbackTimeline.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const FeedbackTimeline = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const employeeId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFeedbacks();
  }, []);
    const handleCommentSubmit = async (id) => {
    try {
        const comment = commentInputs[id];
        await axios.put(
        `/feedback/comment/${id}`,
        { comment },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
        // update UI
        setFeedbacks((prev) =>
        prev.map((fb) =>
            fb.id === id ? { ...fb, employee_comments: comment } : fb
        )
        );
        setCommentInputs((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
        console.error("Failed to add comment:", error);
    }
    };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`/feedback/employee`, {
        params: { employee_id: employeeId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await axios.put(
        `/feedback/acknowledge/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update UI
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === id ? { ...fb, acknowledged: true } : fb
        )
      );
    } catch (error) {
      console.error("Acknowledgment failed:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Feedback Timeline</h2>

      {loading ? (
        <p>Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback available yet.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((fb) => (
              <li
                key={fb.id}
                className="border p-4 rounded-lg shadow bg-white hover:bg-gray-50 transition"
              >
                <div className="text-sm text-gray-600">
                  {new Date(fb.created_at).toLocaleString()}
                </div>
                <div className="font-semibold mt-2">Strengths:</div>
                <p>{fb.strengths}</p>
                <div className="font-semibold mt-2">Areas to Improve:</div>
                <p>{fb.improvements}</p>
                <div className="font-semibold mt-2">Sentiment:</div>
                <p>{fb.sentiment}</p>
                <div className="font-semibold mt-2">Tags:</div>
                <p>{fb.tags.join(", ")}</p>
                <div className="font-semibold mt-2">Acknowledged:</div>
                <p>{fb.acknowledged ? "✅ Yes" : "❌ No"}</p>

                {!fb.acknowledged && (
                  <button
                    className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleAcknowledge(fb.id)}
                  >
                    Acknowledge
                  </button>
                )}

                {!fb.employee_comments && (
                <div className="mt-3">
                    <textarea
                    placeholder="Add your comment..."
                    value={commentInputs[fb.id] || ""}
                    onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [fb.id]: e.target.value })
                    }
                    className="w-full border rounded p-2 mb-2"
                    ></textarea>
                    <button
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleCommentSubmit(fb.id)}
                    >
                    Submit Comment
                    </button>
                </div>
                )}

              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackTimeline;
