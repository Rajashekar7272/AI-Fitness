"use client";

import { cn } from "@/lib/utils";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  DumbbellIcon,
  HomeIcon,
  MenuIcon,
  UserIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/generate-page", label: "Generate", icon: DumbbellIcon },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono mr-1">
            AI<span className="text-primary">Fitness</span>.ai
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          {isSignedIn ? (
            <>
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 text-sm transition-colors hover:text-primary",
                    pathname === href
                      ? "text-primary font-semibold"
                      : "text-foreground"
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
              <Button
                asChild
                variant="outline"
                className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                <Link href="/generate-page">Get Started</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>

        {/* MOBILE NAVIGATION - SIGN IN/SIGN UP BUTTONS WHEN LOGGED OUT */}

        {!isSignedIn && (
          <div className="md:hidden flex items-center gap-2">
            <SignInButton>
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:text-white hover:bg-primary/10 text-xs px-3"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        )}

        {/* HAMBURGER BUTTON - ONLY SHOWN WHEN SIGNED IN */}
        {isSignedIn && (
          <div className="md:hidden px-4 animate-puls">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-black font-semibold py-2 rounded-xl shadow-md hover:shadow-md hover:shadow-green-300 transition-all duration-300 ease-in-out hover:scale-[1.03]"
            >
              <Link href="/generate-page" className="animate-pulse">
                Get Started
              </Link>
            </Button>
          </div>
        )}
        {isSignedIn && (
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        )}
      </div>

      {/* MOBILE MENU - ONLY SHOWN WHEN SIGNED IN */}
      {isSignedIn && (
        <div
          className={cn(
            "md:hidden fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-background/95 backdrop-blur-md border-l border-border transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0 w-64" : "translate-x-full w-64"
          )}
        >
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={toggleMenu}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors hover:text-primary py-2",
                  pathname === href
                    ? "text-primary font-semibold"
                    : "text-foreground"
                )}
              >
                <Icon size={20} />
                {isMenuOpen && <span>{label}</span>}
              </Link>
            ))}
            <Button
              asChild
              variant="outline"
              className="w-full border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              onClick={toggleMenu}
            >
              <Link href="/generate-page">Get Started</Link>
            </Button>
            <div className="flex justify-center">
              <UserButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
