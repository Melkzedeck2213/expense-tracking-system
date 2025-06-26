"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Supabase client
import { supabase } from "@/utils/supabaseClient";

// Input field components
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import Username from "@/components/Username";
import ConfirmPassword from "@/components/ConfirmPassword";
import SubmitButton from "@/components/SubmitButton";
import ClearButton from "@/components/ClearButton";

export default function Page() {
  const router = useRouter();

  const [registering, setRegistering] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");

  // Toggle between register and login
  const toggleRegistering = () => setRegistering(!registering);

  // Reset form
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (registering) {
        if (password !== confirmPassword) {
          alert("Passwords do not match.");
          setIsSubmitting(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: username },
          },
        });

        router.push("/verfiy-email");

        if (error) throw error;
        console.log("User registered:", data);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setUserId(data.user.id);
        router.push("/dashboard");
        console.log("Logged in as:", data.user.email);
      }

      resetForm();
    } catch (error) {
      alert(error.message || "Something went wrong.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-40">
      <div className="p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">
          {registering ? "Join the System" : "Welcome back!"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {registering && (
            <Username
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!registering && (
            <p
              onClick={async () => {
                if (!email) {
                  alert("Please enter your email first.");
                  return;
                }
                const { error } = await supabase.auth.resetPasswordForEmail(
                  email,
                  {
                    redirectTo: `${window.location.origin}/update-password`,
                  }
                );
                if (error) {
                  alert("Error sending reset link: " + error.message);
                } else {
                  alert("Password reset email sent!");
                }
              }}
              className="text-sm text-blue-500 cursor-pointer hover:underline text-right"
            >
              Forgot password?
            </p>
          )}

          {registering && (
            <ConfirmPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <div className="flex flex-row justify-between">
            <SubmitButton
              isSubmitting={isSubmitting}
              text={registering ? "Join" : "Login"}
            />
            <ClearButton onClick={resetForm} />
          </div>

          <p
            onClick={toggleRegistering}
            className="text-blue-500 cursor-pointer text-center"
          >
            {registering
              ? "Already have an account? Click to login."
              : "Don't have an account? Click to register."}
          </p>
        </form>
      </div>
    </div>
  );
}
