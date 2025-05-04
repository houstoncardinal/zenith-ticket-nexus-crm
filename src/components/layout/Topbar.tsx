
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const Topbar = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm">
      <div className="flex-1">
        {!isMobile && (
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets, customers..."
              className="pl-8 bg-background w-full max-w-md"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
          >
            <Search size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
