import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import logo from "/src/assets/0ba20f724921c72e8c564bd1e69901ddf11995e4.png";
import { scrollToTop } from "../../utils/navigation";
import { NavLink } from "./shared/NavLink";
import { SocialLink } from "./shared/SocialLink";

const navItems = [
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter", visible: false },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", visible: false },
  { href: "https://github.com", icon: Github, label: "GitHub", visible: false },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram", visible: true },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={logo}
                alt="LUCE SOLUTIONS"
                className="h-12 cursor-pointer"
                onClick={scrollToTop}
              />
            </div>
            <p className="text-muted-foreground">
              Creating exceptional digital experiences through expert design and development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              {navItems.map((item) => (
                <li key={item.id}>
                  <NavLink sectionId={item.id} variant="desktop">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks
                .filter((link) => link.visible)
                .map((link) => (
                  <SocialLink
                    key={link.label}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Luce Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
