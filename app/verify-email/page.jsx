"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // 🛡️ Protect the route: redirect if no session
  useEffect(() => {
    const protectPage = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        router.push("/register"); // or /login
        return;
      }

      const email = session.user?.email;
      if (email) setUserEmail(email);
    };

    protectPage();
  }, [router]);

  // 🔁 Poll email verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (userData?.user?.email_confirmed_at) {
        router.push("/dashboard");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  // 🔄 Resend logic
  const handleResend = async () => {
    if (!userEmail) {
      setMessage("No email found. Please sign up again.");
      return;
    }

    setResending(true);
    setMessage("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: userEmail,
    });

    if (error) {
      setMessage("Failed to resend email. Try again later.");
      console.error(error.message);
    } else {
      setMessage("Verification email resent. Please check your inbox.");
    }

    setResending(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">Check your email 📧</h1>
      <p className="text-gray-600 text-center mb-6 max-w-sm">
        A confirmation link was sent to <strong>{userEmail}</strong>. Click it to activate your account.
      </p>

      <button
        onClick={handleResend}
        disabled={resending}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {resending ? "Resending..." : "Resend Verification Email"}
      </button>

      {message && (
        <p className="mt-4 text-sm text-green-600 text-center max-w-sm">
          {message}
        </p>
      )}

      <p className="mt-8 text-sm text-gray-500">Still waiting? Check your spam folder.</p>
    </div>
  );
}
