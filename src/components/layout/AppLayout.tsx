
import React from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import AppSidebar from "./AppSidebar";
import Topbar from "./Topbar";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {!isMobile && <AppSidebar />}
      <div className={cn("flex-1 flex flex-col h-full overflow-hidden border-l border-gray-100")}>
        <Topbar />
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
