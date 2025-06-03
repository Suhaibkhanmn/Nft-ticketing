"use client";

import { motion } from "framer-motion";
import { Users, Ticket, Calendar, TrendingUp } from "lucide-react";

export function StatsSection() {
    const stats = [
        {
            icon: Users,
            value: "50K+",
            label: "Active Users",
            description: "Growing community of event enthusiasts"
        },
        {
            icon: Ticket,
            value: "100K+",
            label: "Tickets Sold",
            description: "Secure NFT tickets issued"
        },
        {
            icon: Calendar,
            value: "1K+",
            label: "Events Created",
            description: "Successful events hosted"
        },
        {
            icon: TrendingUp,
            value: "95%",
            label: "Satisfaction Rate",
            description: "Happy users and organizers"
        }
    ];

    return (
        <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
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
                            <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                        <p className="text-lg font-medium mb-1">{stat.label}</p>
                        <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
} 