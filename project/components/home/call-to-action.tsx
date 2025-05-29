"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/providers/web3-provider";
import { Calendar, Users } from "lucide-react";

export function CallToAction() {
  const { connect, wallet } = useWeb3();

  return (
    <section className="py-16">
      <motion.div 
        className="rounded-3xl overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background p-8 md:p-12 lg:p-16 backdrop-blur">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Ready to Revolutionize Your Events?
            </motion.h2>
            
            <motion.p 
              className="text-lg mb-8 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Whether you're an event organizer or attendee, join our platform for a secure, 
              transparent, and enjoyable ticketing experience.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {wallet.isConnected ? (
                <Button size="lg\" className="group\" asChild>
                  <Link href="/events/create">
                    <Calendar className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Create Your First Event
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={connect}
                  disabled={wallet.isConnecting}
                  className="group"
                >
                  <Users className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  {wallet.isConnecting ? "Connecting..." : "Join the Community"}
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link href="/events">
                  Explore Events
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}