"use client";
import NavBar from "@/components/NavBar";

export default function Dashboard() {

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
        <p>{greetings()},</p>
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
