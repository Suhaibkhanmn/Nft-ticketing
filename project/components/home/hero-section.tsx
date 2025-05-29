"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useWeb3 } from "@/providers/web3-provider";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";

export function HeroSection() {
  const { connect, wallet } = useWeb3();

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10" />
      
      {/* Background image */}
      <div className="absolute inset-0">
        <Image 
          src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
          alt="Concert crowd"
          fill
          quality={90}
          priority
          className="object-cover object-center opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Future of Event Ticketing is <span className="text-primary">Here</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Secure, transparent, and transferable NFT tickets for events of all sizes. 
            Create, collect, and trade tickets on our decentralized platform.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" asChild>
              <Link href="/events">
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            {!wallet.isConnected && (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={connect}
                disabled={wallet.isConnecting}
                className="group"
              >
                <Ticket className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
            
            {wallet.isConnected && (
              <Button size="lg" variant="outline" asChild>
                <Link href="/events/create">
                  Create Event
                </Link>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}