
import { useNavigate, Link } from "react-router-dom";
import { Bell, Menu, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-black/30 border-b border-white/10">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-black/95 border-r border-white/10 p-0">
              <div className="flex flex-col h-full">
                <div className="border-b border-white/10 px-6 py-4">
                  <h2 className="text-lg font-bold text-white">
                    CS:GO Skin Tracker
                  </h2>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <ul className="grid gap-1 px-2">
                    <li>
                      <Link
                        to="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-colors hover:bg-white/10"
                        onClick={() => navigate("/")}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/inventory"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-colors hover:bg-white/10"
                        onClick={() => navigate("/inventory")}
                      >
                        Inventory
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/marketplace"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-colors hover:bg-white/10"
                        onClick={() => navigate("/marketplace")}
                      >
                        Marketplace
                      </Link>
                    </li>
                  </ul>
                </nav>
                {user && (
                  <div className="border-t border-white/10 p-4">
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-xl font-bold text-white hidden md:block">
            CS:GO Skin Tracker
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-5">
          <Link
            to="/"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            to="/inventory"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Inventory
          </Link>
          <Link
            to="/marketplace"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Marketplace
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-white/70 hover:text-white"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-2">
                <UserCircle className="h-8 w-8 text-white/80" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut} 
                  className="text-sm text-white/70 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-sm text-white/70 hover:text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
