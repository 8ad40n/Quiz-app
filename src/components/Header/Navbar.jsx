"use client";
import { AuthContext } from "@/providers/AuthProvider";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { user, Logout } = useContext(AuthContext);
  const router = useRouter();
  const handleLogout = () => {
    Logout()
      .then(() => {
        toast.success("Logged out");
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div>
      <div
        className="flex justify-between items-center bg-gray-800 text-white p-4"
      >
        <Link href="/" className="text-lg font-bold">Quiz App</Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <Link href="/leaderboard" className="text-white text-sm hover:text-gray-300">
              Leaderboard
            </Link>
            <Link href="/quiz" className="text-white text-sm hover:text-gray-300">
              Quiz
            </Link>
            <Button onClick={handleLogout} className="text-white text-sm hover:text-gray-300">Logout</Button>
          </div>
        ) : (
          <Link href="/login" className="text-white text-sm hover:text-gray-300">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
