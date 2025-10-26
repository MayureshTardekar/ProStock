import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Tagline from "@/components/Tagline";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";

const Index = () => {
  const isAuthenticated = typeof window !== 'undefined' && Boolean(localStorage.getItem("prostock_auth"));
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Tagline />
      <Footer />
    </div>
  );
};

export default Index;
