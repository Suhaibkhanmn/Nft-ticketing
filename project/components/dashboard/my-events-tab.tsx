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

// Mock events data
const MOCK_EVENTS = [
  {
    id: "1",
    name: "Web3 Workshop 2025",
    description: "Learn about Web3 development and blockchain",
    date: new Date("2025-06-10T10:00:00"),
    location: "Virtual Event",
    price: 0.02,
    currency: "ETH",
    maxTickets: 200,
    soldTickets: 86,
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "conference",
    status: "active",
    published: true,
  },
  {
    id: "2",
    name: "NFT Showcase 2025",
    description: "Exhibition of the best NFT art from around the world",
    date: new Date("2025-09-22T14:00:00"),
    location: "New York, NY",
    price: 0.05,
    currency: "ETH",
    maxTickets: 150,
    soldTickets: 24,
    image: "https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "exhibition",
    status: "draft",
    published: false,
  }
];

export function MyEventsTab() {
  const [activeTab, setActiveTab] = useState("active");

  const activeEvents = MOCK_EVENTS.filter(event => event.published);
  const draftEvents = MOCK_EVENTS.filter(event => !event.published);

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
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          {activeEvents.length === 0 ? (
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
        
        <TabsContent value="draft" className="mt-6">
          {draftEvents.length === 0 ? (
            <div className="text-center py-16">
              <Edit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Draft Events</h3>
              <p className="text-muted-foreground mt-2 mb-6">You don't have any draft events.</p>
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
              {draftEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <div className="text-center py-16">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Past Events</h3>
            <p className="text-muted-foreground mt-2 mb-6">You don't have any past events.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EventCardProps {
  event: typeof MOCK_EVENTS[0];
}

function EventCard({ event }: EventCardProps) {
  const formattedDate = format(event.date, "MMM d, yyyy");
  const formattedTime = format(event.date, "h:mm a");
  const soldPercentage = (event.soldTickets / event.maxTickets) * 100;
  
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
                {!event.published && (
                  <Badge variant="outline" className="mt-1">
                    Draft
                  </Badge>
                )}
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
                <span className="font-medium">{event.soldTickets} of {event.maxTickets}</span>
              </div>
              <Progress value={soldPercentage} className="h-2" />
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}