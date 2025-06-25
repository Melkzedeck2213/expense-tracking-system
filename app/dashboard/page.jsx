"use client";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/utils/supabaseClient";

export default function Dashboard() {

  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

useEffect(() => {
  const protectPage = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      setErrorMessage(error.message);
      router.push('/auth'); // stop further execution if there's an error
    }

    if (!data?.user) {
      router.push('/auth');
    } else {
      setUserEmail(data.user.email);
      setUsername(data.user.user_metadata?.full_name)
    }
  };

  protectPage();
}, [router]);



    const greetings = () => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good Morning";
        }
        else if (hour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    }


  return (
    <div>
      <NavBar />
      {/*Greeting*/}

      <div className="flex flex-col items-center justify-center h-screen">
        <p>{greetings()} {userName},you are logged in with the email {userEmail}</p>
        <p className="text-lg text-gray-700">Welcome to your dashboard!</p>
        <div className="mt-8">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Action Button
          </button>
        </div>
      </div>
    </div>
  );
}
