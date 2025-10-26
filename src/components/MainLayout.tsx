import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen gradient-hero transition-theme">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
