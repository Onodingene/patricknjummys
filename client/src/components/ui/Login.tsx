import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import signup from "@/assets/signup.jpg";

// Define the form data type
interface LoginFormData {
  email: string;
  password: string;
}

// Define the expected backend response type
interface LoginResponse {
  message: string;
  token?: string;
  errors?: string[];
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/login', data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      toast.success('Login successful!');
      // Store token in localStorage or context for authenticated routes
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      reset();
      navigate('/'); // Redirect to homepage or dashboard
    } catch (error) {
      const axiosError = error as AxiosError<LoginResponse>;
      if (axiosError.response) {
        const errorMessage = axiosError.response.data?.message || 'Login failed';
        const validationErrors = axiosError.response.data?.errors;
        if (validationErrors && validationErrors.length > 0) {
          setErrorMessage(`Validation Error: ${validationErrors.join(', ')}`);
          toast.error(`Validation Error: ${validationErrors.join(', ')}`);
        } else {
          setErrorMessage(errorMessage);
          toast.error(errorMessage);
        }
      } else if (axiosError.request) {
        setErrorMessage('Network error: Could not connect to server. Please check if the backend is running.');
        toast.error('Network error: Could not connect to server.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Log In to Your Account
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Welcome back! Log in to continue ordering your favorite custom and express cakes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Login Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Log In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    placeholder="Enter your email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    placeholder="Enter your password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging In...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>
                {errorMessage && (
                  <div className="p-4 rounded-lg text-sm bg-red-100 text-red-800 border border-red-300">
                    {errorMessage}
                  </div>
                )}
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-primary hover:underline">
                    Sign up
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Decorative Image */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={signup}
                alt="Login illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;