
import { Bell, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const Topbar = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 bg-white">
      <div className="flex-1">
        {!isMobile && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets, customers..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white w-full max-w-md"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        >
          <HelpCircle size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            <Search size={20} />
          </Button>
        )}
        
        <div className="ml-2 flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
