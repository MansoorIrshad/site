
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, type User } from 'firebase/auth';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';

// Hardcoded admin credentials
const ADMIN_EMAIL = "brandboy553340@gmail.com";
const ADMIN_PASSWORD = "117691tcs";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Step 1: Check for hardcoded admin credentials first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // This is the admin. We don't need to call Firebase Auth for this mock admin.
      // We'll create a mock user object to store in state/local storage.
      const mockAdminUser = {
        uid: 'admin_user_mock_uid', // A consistent mock UID
        email: ADMIN_EMAIL,
      };

      // Store admin role in localStorage
      localStorage.setItem(`userProfile_${mockAdminUser.uid}`, JSON.stringify({ role: 'admin' }));
      
      // Simulate a session for the admin (since we are not using Firebase session)
      // This part is tricky without a real session, local storage is the simplest way
      sessionStorage.setItem('loggedInUser', JSON.stringify(mockAdminUser));


      toast({
        title: 'Login Successful',
        description: 'Welcome back, Admin!',
      });
      router.push('/seller/dashboard');
      setLoading(false);
      return; // Stop execution here for admin
    }


    // Step 2: If not admin, proceed with Firebase authentication for regular users
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // All other users are buyers
      const role = 'buyer';
      
      // Store role in localStorage
      localStorage.setItem(`userProfile_${userCredential.user.uid}`, JSON.stringify({ role: role }));

      toast({
        title: 'Login Successful',
        description: `Welcome back!`,
      });
      
      router.push('/'); // Redirect regular users to homepage

    } catch (err: any) {
      console.error("Login error:", err);
      let errorMessage = "Failed to login. Please check your credentials.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      setError(errorMessage);
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to Dazelle.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/signup">Sign up</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
