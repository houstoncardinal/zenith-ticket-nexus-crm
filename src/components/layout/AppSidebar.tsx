
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Ticket,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
};

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", color: "#4C6FFF" },
  { icon: Ticket, label: "Tickets", href: "/tickets", color: "#00C48C" },
  { icon: Users, label: "Customers", href: "/customers", color: "#7B61FF" },
  { icon: MessageSquare, label: "Messages", href: "/messages", color: "#FF6B6B" },
  { icon: BarChart3, label: "Reports", href: "/reports", color: "#FFAB2D" },
  { icon: Settings, label: "Settings", href: "/settings", color: "#6E7891" },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              Zenith
              <span className="text-primary">.</span>
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "ml-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            collapsed && "mx-auto"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 pt-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center py-2.5 px-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-gray-50" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "text-gray-900" : "text-gray-500"
                    )}
                    style={isActive ? { color: item.color } : {}}
                  />
                  {!collapsed && (
                    <span 
                      className={cn(
                        "ml-3",
                        isActive ? "font-medium text-gray-900" : "text-gray-500"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div 
                      className="ml-auto h-2 w-2 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@zenith.com</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
              A
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
