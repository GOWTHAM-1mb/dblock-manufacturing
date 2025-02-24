
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Upload, Quote, Package, User, LogOut, Menu } from "lucide-react";
import { signOut } from "@/lib/auth";
import { useToast } from "./ui/use-toast";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Upload, label: "Submit RFQ", href: "/submit-rfq" },
  { icon: Quote, label: "View Quotes", href: "/quotes" },
  { icon: Package, label: "View Orders", href: "/orders" },
  { icon: User, label: "Account Settings", href: "/settings" },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle sidebar collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-gradient-to-br from-white to-gray-50 dark:from-navy-light dark:to-navy border-r border-gray-200/50 transition-all duration-300 relative group",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
        {!isCollapsed && (
          <span className="text-lg font-semibold bg-gradient-to-r from-navy to-primary bg-clip-text text-transparent">
            D Block
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-300 relative group/item",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-100/50 dark:text-gray-200 dark:hover:bg-white/5",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-primary/10 rounded-full blur-md transition-opacity duration-300 opacity-0 group-hover/item:opacity-50" />
                    <item.icon className="h-5 w-5 shrink-0 relative z-10" />
                  </div>
                  {!isCollapsed && <span>{item.label}</span>}
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-gray-700 hover:bg-gray-100/50 dark:text-gray-200 dark:hover:bg-white/5 group/logout",
            isCollapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-red-500/10 rounded-full blur-md transition-opacity duration-300 opacity-0 group-hover/logout:opacity-50" />
            <LogOut className="h-5 w-5 shrink-0 relative z-10" />
          </div>
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
