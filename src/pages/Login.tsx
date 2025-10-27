import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call backend login API
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear any previous user's cached data
        localStorage.removeItem("userProfile");
        localStorage.removeItem("prostock_trading_data");
        
        // Store auth token and user info
        localStorage.setItem("prostock_auth", "true");
        localStorage.setItem("prostock_token", data.token);
        localStorage.setItem("prostock_user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to connect to server. Please ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero transition-theme">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl shadow-elegant p-8 transition-theme">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to access your ProStock account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-border focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background/50 border-border focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 gradient-primary text-white font-semibold rounded-full shadow-elegant transition-theme hover:shadow-lg"
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
