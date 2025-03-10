"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  googleId: string;
  image: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null); // ✅ Explicit type
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/profile", {
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
  
        const data = await response.json();
        console.log("Profile Data:", data); // ✅ Debugging
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/v1/logout", { credentials: "include" });
    router.push("/");
  };

  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (!user) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
      <img
  src={user.image ? user.image : "https://via.placeholder.com/150"} // ✅ Default if missing
  alt="Profile"
  className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500"
/>

        <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
