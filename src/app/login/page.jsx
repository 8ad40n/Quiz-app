"use client";
import { AuthContext } from "@/providers/AuthProvider";
import { Button } from "antd";
import { Brain, Chrome, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const { LoginWithGoogle } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await LoginWithGoogle();
      toast.success(`Welcome ${result.user.displayName}`);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Brain className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to Quiz App
            </h1>
            <p className="text-gray-500">
              Sign in to start your learning journey
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center space-x-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="animate-spin w-5 h-5 text-blue-500" />
            ) : (
              <Chrome className="w-5 h-5 text-blue-500" />
            )}
            <span className="text-gray-700 font-medium">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}