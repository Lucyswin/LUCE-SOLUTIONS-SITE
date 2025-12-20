import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "/src/assets/0ba20f724921c72e8c564bd1e69901ddf11995e4.png";
import { scrollToTop, scrollToSection } from "../../utils/navigation";
import { NavLink } from "./shared/NavLink";
import { Button } from "./shared/Button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="LUCE SOLUTIONS"
              className="h-12 cursor-pointer"
              onClick={scrollToTop}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink key={item.id} sectionId={item.id} variant="desktop">
                {item.label}
              </NavLink>
            ))}
            <Button variant="primary" onClick={() => scrollToSection("contact")}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            {navItems.map((item) => (
              <div key={item.id} className="block w-full text-left px-4 py-2">
                <NavLink sectionId={item.id} variant="mobile" onClick={closeMenu}>
                  {item.label}
                </NavLink>
              </div>
            ))}
            <div className="px-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  scrollToSection("contact");
                  closeMenu();
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
