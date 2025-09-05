import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import pjlogo from "@/assets/pjlogo.png";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 h-full w-20">
            <img src={pjlogo}  onClick={() => navigate("/")} className=""/>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a   onClick={() => navigate("/")} className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a onClick={() => navigate("/customize")} className="text-foreground hover:text-primary transition-colors">
              Build Your Cake
            </a>
            <a onClick={() => navigate("/gallery")} className="text-foreground hover:text-primary transition-colors">
              Gallery
            </a>
            {/* <a href="/menu.pdf" download="Bakery_Menu.pdf" className="text-foreground hover:text-primary transition-colors">
            Menu
            </a> */}
          
            
              <a href="/menu.pdf" target="_blank" rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors">
            Menu
          </a>

            <a href="#orders" className="text-foreground hover:text-primary transition-colors">
              Last Minute Orders
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
              <ShoppingCart 
              className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-border">
              <a
                href="#home"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#customize"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Build Your Cake
              </a>
              <a
                href="#gallery"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </a>
              

              <a
                href="#orders"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Last Minute Orders
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;