"use client";
import { useState } from "react";

export default function SubscribeButton({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const [loading, setLoading] = useState(false);

  // const handleSubscribe = async () => {
  //   setLoading(true);
  //   const res = await fetch("/api/xendit/subscribe", {
  //     method: "POST",
  //     body: JSON.stringify({ userId, email }),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const data = await res.json();
  //   setLoading(false);
  //   if (data.linking_url) {
  //     window.location.href = data.linking_url;
  //   } else {
  //     alert("Failed to initiate subscription");
  //   }
  // };
  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch("/api/xendit", {
      method: "GET",
    });
    const data = await res.json();
    console.log("data", data);
    setLoading(false);
    if (data) {
      // console.log("url", data.actions);
      window.location.href = data.actions;
    } else {
      alert("Failed to initiate subscription");
    }
  };

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={handleSubscribe}
      disabled={loading}
    >
      {loading ? "Redirecting..." : "Subscribe"}
    </button>
  );
}
