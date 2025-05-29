"use client";

import { motion } from "framer-motion";
import { Ticket, Shield, RefreshCcw, Wallet, Link, Globe } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Ticket,
      title: "NFT Tickets",
      description: "Unique digital tickets as NFTs that can't be counterfeited, providing authenticity and ownership."
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "All ticket sales and transfers are secured by blockchain technology for maximum protection."
    },
    {
      icon: RefreshCcw,
      title: "Transparent Resales",
      description: "Secondary market sales with built-in royalties for event organizers and fair pricing."
    },
    {
      icon: Wallet,
      title: "Easy Management",
      description: "All your tickets in one place with a simple user interface and mobile access."
    },
    {
      icon: Link,
      title: "No Intermediaries",
      description: "Direct connection between event organizers and attendees without unnecessary fees."
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Buy and sell tickets worldwide with automatic currency conversion and no boundaries."
    }
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why Choose NFT Tickets?
        </motion.h2>
        <motion.p 
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Our blockchain-based ticketing system offers unique advantages for event organizers and attendees.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl border bg-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}