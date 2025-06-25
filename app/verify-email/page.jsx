"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resendVerification = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setMessage("Couldn't get user. Please try again.");
      setLoading(false);
      return;
    }

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    });

    if (resendError) {
      setMessage("Error sending verification email. Try again later.");
    } else {
      setMessage("Verification email resent! Check your inbox.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl mb-4">Please verify your email to continue</h2>
      <button
        onClick={resendVerification}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
