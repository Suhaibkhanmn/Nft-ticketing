"use client";

import { motion } from "framer-motion";
import { EventType } from "@/types/events";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

interface EventCardProps {
  event: EventType;
}

export function EventCard({ event }: EventCardProps) {
  // Format date and time
  const formattedDate = format(event.date, "MMM d, yyyy");
  const formattedTime = format(event.date, "h:mm a");
  
  // Calculate ticket availability percentage
  const availabilityPercentage = (event.remainingTickets / event.maxTickets) * 100;
  
  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 17 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link href={`/events/${event.id}`}>
        <Card className="overflow-hidden h-full flex flex-col cursor-pointer border-2 hover:border-primary/50 transition-colors">
          <div className="relative h-48 w-full">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/70">
                {event.category}
              </Badge>
            </div>
          </div>
          
          <CardContent className="flex-1 pt-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold line-clamp-2">{event.name}</h3>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                {formattedTime}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {event.location}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Availability</span>
                <span className="font-medium">{event.remainingTickets} of {event.maxTickets}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${availabilityPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t bg-muted/30 p-4">
            <div className="flex items-center justify-between w-full">
              <p className="font-semibold">{event.price} {event.currency}</p>
              <Button size="sm" variant="default">View Event</Button>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}