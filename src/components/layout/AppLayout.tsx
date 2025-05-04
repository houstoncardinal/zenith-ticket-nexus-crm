
import React from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import AppSidebar from "./AppSidebar";
import Topbar from "./Topbar";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isMobile && <AppSidebar />}
      <div className={cn("flex-1 flex flex-col h-full overflow-hidden")}>
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
