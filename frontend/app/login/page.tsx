"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // For demo purposes, show error for invalid credentials
      if (
        formData.email !== "admin@mediroute.com" ||
        formData.password !== "password123"
      ) {
        setError("Invalid email or password");
      } else {
        // Successful login - redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 lg:py-8 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <Stethoscope className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-gray-900">
                MediRoute
              </span>
            </Link>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome to MediRoute
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Sign in to access your hospital management dashboard
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@mediroute.com"
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="h-12 text-base pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Login to MediRoute"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>

              {/* <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div> */}
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          {/* <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Demo Credentials
            </p>
            <p className="text-xs text-blue-600">
              Email: admin@mediroute.com
              <br />
              Password: password123
            </p>
          </div> */}
        </div>
      </div>

      {/* Right Side - Hospital Image (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* <img
          src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Hospital Staff Management"
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        <Image
          src="/images/login.jpg"
          alt="Hospital staff looking at x-rays"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white bg-black/20">
          <h2 className="text-3xl font-bold mb-4">
            Streamline Hospital Operations
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed max-w-md">
            Join thousands of healthcare professionals who trust MediRoute to
            optimize their hospital workflows, reduce wait times, and improve
            patient care.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mt-8 max-w-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-blue-200">Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">35%</div>
              <div className="text-sm text-blue-200">Efficiency Boost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
