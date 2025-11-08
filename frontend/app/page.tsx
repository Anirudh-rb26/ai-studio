"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeClosedIcon, Lock, Mail } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  // Toggle States
  const [signupToggle, setSignupToggle] = useState(false);
  const [viewPasswordToggle, setViewPasswordToggle] = useState(false);

  const [loading, setIsLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    // Additional validation for signup mode
    if (signupToggle) {
      if (!confirmPassword) {
        setPasswordError("Please confirm your password");
        isValid = false;
      } else if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        isValid = false;
      }
    }

    if (isValid) {
      console.log("Form is valid", { email, password });
      setIsLoading(true);
      router.push('/home')
      setIsLoading(false);
    }
  };

  // Handle mode toggle
  const handleModeToggle = () => {
    setSignupToggle(!signupToggle);
    setEmailError("");
    setPasswordError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>{signupToggle ? "Signup" : "Login"}</CardTitle>
          <CardDescription>
            {signupToggle ? "Create a new account" : "Login to your existing account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <InputGroup>
              <InputGroupAddon>
                <Mail className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                disabled={loading && true}
                placeholder="E-Mail Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
            </InputGroup>
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <InputGroup>
              <InputGroupAddon>
                <Lock className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Password"
                disabled={loading && true}
                type={viewPasswordToggle ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(""); // Clear error on change
                }}
              />
              <InputGroupAddon align="inline-end">
                <Button variant={"ghost"} onClick={() => setViewPasswordToggle(!viewPasswordToggle)}>
                  {viewPasswordToggle ?
                    <Eye /> :
                    <EyeClosedIcon />
                  }
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Confirm Password Field (Signup Only) */}
          {signupToggle && (
            <div className="space-y-1">
              <InputGroup>
                <InputGroupAddon>
                  <Lock className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  disabled={loading && true}
                  placeholder="Confirm Password"
                  type={viewPasswordToggle ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError(""); // Clear error on change
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <Button variant={"ghost"} onClick={() => setViewPasswordToggle(!viewPasswordToggle)}>
                    {viewPasswordToggle ?
                      <Eye /> :
                      <EyeClosedIcon />
                    }
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </div>
          )}

          {/* Password Error Message */}
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            onClick={handleSubmit}
            disabled={loading && true}
          >
            {signupToggle ? "Sign Up" : "Login"}
            {loading && <Spinner />}
          </Button>
          <Button
            variant="ghost"
            onClick={handleModeToggle}
            disabled={loading && true}
          >
            {signupToggle ? "Already have an account?" : "Create an Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
