"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkEmailVerified = async () => {
      setChecking(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) return;

      const { data: userData, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (userData?.user?.email_confirmed_at) {
        router.push("/dashboard"); // or wherever you want
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(checkEmailVerified, 5000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Check your email 📧</h1>
      <p className="text-gray-600 text-center w-80">
        A confirmation link has been sent to your inbox. Click the link to activate your account.
      </p>
      {checking && <p className="mt-4 text-sm text-blue-500">Waiting for confirmation...</p>}
    </div>
  );
}
