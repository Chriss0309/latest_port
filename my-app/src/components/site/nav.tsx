"use client";

import { Github, Linkedin, Mail, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/christopher-ooi-825138207/", Icon: Linkedin },
  { label: "X", href: "https://x.com/chris_00OO", Icon: XIcon },
  { label: "GitHub", href: "https://github.com/Chriss0309", Icon: Github },
  { label: "Email", href: "mailto:ooichristopher8@gmail.com", Icon: Mail },
];

const resume = { label: "Resume", href: "/Christopher_Ooi_Resume.pdf" };

export function SiteNav() {
  return (
    <header className="flex items-center justify-end px-6 py-3 md:px-12">
      <nav className="hidden items-center gap-5 md:flex">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            <Icon className="size-[18px]" />
          </a>
        ))}
        <a
          href={resume.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] text-foreground/70 transition-colors hover:text-foreground"
        >
          {resume.label}
        </a>
      </nav>

      <Sheet>
        <SheetTrigger
          aria-label="Open menu"
          className="text-foreground/70 transition-colors hover:text-foreground md:hidden"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="right" className="bg-background">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav className="mt-12 flex flex-col">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 text-[15px] text-foreground/70 transition-colors hover:text-foreground"
              >
                <Icon className="size-[18px]" />
                {label}
              </a>
            ))}
            <a
              href={resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-[15px] text-foreground/70 transition-colors hover:text-foreground"
            >
              {resume.label}
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
