/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Image from "next/image";
import { forgotPassword } from "@/api/api";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await forgotPassword(email);
      setIsEmailSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (err: any) {
      if (err.message.includes("Network Error")) {
        setError("Network error. Please try again.");
      } else {
        setIsEmailSent(true);
        toast.success(
          "If an account with that email exists, a password reset link has been sent."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-4 lg:py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mt-4">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Stethoscope className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                MediRoute
              </span>
            </Link>
          </div>

          {/* Success Card */}
          <Card className="shadow-xl border-0">
            <CardContent className="pt-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your email and follow the instructions to reset
                your password.
              </p>
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEmailSent(false)}
                >
                  Try Different Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <Stethoscope className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                MediRoute
              </span>
            </Link>
          </div>

          {/* Forgot Password Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Forgot Password?
              </CardTitle>
              <p className="text-gray-600 mt-2">
                No worries! Enter your email and we'll send you a reset link.
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
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@mediroute.com"
                    className="h-12 text-base"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Hospital Image (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <Image
          src="https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Hospital staff looking at x-rays"
          fill
          className="opacity-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white bg-black/20">
          <h2 className="text-3xl font-bold mb-4">
            Secure Access to Your Platform
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed max-w-md">
            Your hospital data security is our priority. Reset your password
            safely and get back to optimizing your healthcare operations.
          </p>

          {/* Security Features */}
          <div className="grid grid-cols-1 gap-4 mt-8 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-blue-100">256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-blue-100">HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
