"use client";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExpenseCharts from "@/components/ExpensesChart";

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
      setUserName(data.user.user_metadata?.full_name)
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

          <div className="flex flex-col items-center pt-24 px-4 my-30">
        <p>{greetings()} {userName}</p>
        
        <p>you are logged in with the email {userEmail}</p>
        
        <div className="mt-8">
          <ExpenseCharts/>
        </div>
      </div>
    </div>
  );
}
