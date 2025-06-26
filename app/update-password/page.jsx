"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import PasswordInput from "@/components/PasswordInput";
import ConfirmPassword from "@/components/ConfirmPassword";
import SubmitButton from "@/components/SubmitButton";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert("Failed to reset password: " + error.message);
    } else {
      alert("Password updated! You can now log in.");
      router.push("/"); // redirect to login or dashboard
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center my-40">
      <div className="p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">
          Set a New Password
        </h1>
        <form onSubmit={handlePasswordUpdate} className="flex flex-col space-y-4">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ConfirmPassword
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <SubmitButton isSubmitting={isSubmitting} text="Update Password" />
        </form>
      </div>
    </div>
  );
}
