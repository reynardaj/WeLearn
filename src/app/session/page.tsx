"use client";
import { useState } from "react";
import { format } from "date-fns";

export default function SessionPage() {
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [duration, setDuration] = useState(60);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/zoom/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          start_time: startTime.toISOString(),
          duration,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMeetingUrl(data.meeting.join_url);
      } else {
        alert("Failed to create meeting");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Zoom Meeting</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Meeting Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={format(startTime, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setStartTime(new Date(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
            required
            min="1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Meeting"}
        </button>
      </form>

      {meetingUrl && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Meeting Created Successfully!
          </h2>
          <p className="mb-2">Join URL: {meetingUrl}</p>
          <button
            onClick={() => window.open(meetingUrl, "_blank")}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Open Meeting
          </button>
        </div>
      )}
    </div>
  );
}
