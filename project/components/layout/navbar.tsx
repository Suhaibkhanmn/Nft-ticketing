"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/providers/web3-provider";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X, Ticket, Calendar, CircleDollarSign, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { wallet, connect, disconnect } = useWeb3();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Create Event", href: "/events/create", icon: Calendar },
    { name: "My Tickets", href: "/tickets", icon: Ticket },
    { name: "Dashboard", href: "/dashboard", icon: UserCircle },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center space-x-2">
              <Ticket className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl hidden sm:inline-block">NFTix</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                          pathname === link.href
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            
            {/* Wallet Connect Button */}
            {!wallet.isConnected ? (
              <Button
                onClick={connect}
                variant="default"
                size="sm"
                className="hidden sm:flex"
                disabled={wallet.isConnecting}
              >
                {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {wallet.address?.substring(0, 6)}...{wallet.address?.substring(38)}
                </div>
                <Avatar className="h-8 w-8 cursor-pointer" onClick={disconnect}>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {wallet.address?.substring(2, 4)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-background border-b"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.name}
              </Link>
            ))}
            
            {!wallet.isConnected && (
              <Button
                onClick={connect}
                variant="default"
                size="sm"
                className="w-full mt-4"
                disabled={wallet.isConnecting}
              >
                {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}