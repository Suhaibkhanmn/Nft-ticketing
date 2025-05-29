"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCard } from "@/components/events/event-card";
import { useEventsQuery } from "@/hooks/use-events";
import { Search } from "lucide-react";

export function EventsList() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: events, isLoading } = useEventsQuery();

  // Filter events based on category and search query
  const filteredEvents = events?.filter(event => {
    const matchesCategory = category === "all" || event.category === category;
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Categories for the tabs
  const categories = [
    { id: "all", name: "All Events" },
    { id: "music", name: "Music" },
    { id: "sports", name: "Sports" },
    { id: "conference", name: "Conference" },
    { id: "exhibition", name: "Exhibition" },
  ];

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
          <p className="text-muted-foreground mt-2">
            Discover and book tickets for the hottest events
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10 w-full sm:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select defaultValue="upcoming" onValueChange={(value) => console.log(value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setCategory}>
        <TabsList className="mb-6 flex flex-wrap h-auto p-1 sm:h-10">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat.id}
              value={cat.id}
              className="py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={category} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  className="h-[360px] rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filteredEvents?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredEvents?.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 text-center">
        <Button size="lg" variant="outline" asChild>
          <a href="/events">View All Events</a>
        </Button>
      </div>
    </section>
  );
}