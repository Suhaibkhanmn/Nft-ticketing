"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, BarChart3, MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { useEventsQuery } from "@/hooks/use-events";
import { EventType } from "@/types/events";

export function MyEventsTab() {
  const [activeTab, setActiveTab] = useState("active");
  const { data: myEvents, isLoading } = useEventsQuery(true);
  console.log('Dashboard - myEvents:', myEvents, 'isLoading:', isLoading);

  // For now, all events are considered 'active' (no draft/past logic from contract)
  const activeEvents = myEvents || [];
  // Optionally, you can filter for draft/past if you add such logic to your contract

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Events</h2>
        <Button asChild>
          <Link href="/events/create">Create New Event</Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Events</TabsTrigger>
          {/* You can add more tabs for draft/past if you implement that logic */}
        </TabsList>
        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <div className="text-center py-16">Loading your events...</div>
          ) : activeEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Active Events</h3>
              <p className="text-muted-foreground mt-2 mb-6">You don't have any active events.</p>
              <Button asChild>
                <Link href="/events/create">Create New Event</Link>
              </Button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {activeEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EventCardProps {
  event: EventType;
}

function EventCard({ event }: EventCardProps) {
  const formattedDate = format(event.date, "MMM d, yyyy");
  const formattedTime = format(event.date, "h:mm a");
  const sold = event.maxTickets - event.remainingTickets;
  const soldPercentage = (sold / event.maxTickets) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="flex h-40 sm:h-48">
        <div className="relative w-1/3">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="w-2/3 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{event.name}</h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/events/${event.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Event
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pb-0 flex-1">
            <div className="space-y-1 text-sm">
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
          </CardContent>

          <CardFooter className="pt-4 pb-4">
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>Tickets Sold</span>
                <span className="font-medium">{sold} of {event.maxTickets}</span>
              </div>
              <Progress value={soldPercentage} className="h-2" />
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}