"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Linkedin, Mail, Github } from "lucide-react";
import { useState } from "react";

export function NavbarDemo() {
  const socialLinks = [
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/christopher-ooi-825138207/",
      icon: Linkedin,
    },
    {
      name: "Twitter",
      link: "https://x.com/chris_00OO",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      link: "https://github.com/Chriss0309",
      icon: Github,
    },
    {
      name: "Email",
      link: "mailto:ooichristopher8@gmail.com",
      icon: Mail,
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-18">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          {/* Social Media Icons */}
          <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-6 lg:flex">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  title={social.name}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <NavbarButton 
              variant="secondary" 
              href="/Christopher_OOI_Resume (1).pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </NavbarButton>
            <NavbarButton 
              variant="primary"
              href="mailto:ooichristopher8@gmail.com"
            >
              Contact Me
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
          >
            {/* Mobile Social Links */}
            <div className="flex gap-6 w-full justify-center py-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    title={social.name}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
            
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
                href="/Christopher_OOI_Resume (1).pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
                href="mailto:ooichristopher8@gmail.com"
              >
                Contact Me
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

