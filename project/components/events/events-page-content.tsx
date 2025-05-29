"use client";

import { useState } from "react";
import { useEventsQuery } from "@/hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { Search, Calendar as CalendarIcon, MapPin, Filter } from "lucide-react";
import { format } from "date-fns";

export function EventsPageContent() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priceRange, setPriceRange] = useState([0, 0.5]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: events, isLoading } = useEventsQuery();

  // Filter events based on all criteria
  const filteredEvents = events?.filter(event => {
    const matchesCategory = category === "all" || event.category === category;
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
    const matchesDate = !date || (date && new Date(event.date).toDateString() === date.toDateString());
    
    return matchesCategory && matchesSearch && matchesPrice && matchesDate;
  });

  // Categories for the tabs
  const categories = [
    { id: "all", name: "All Events" },
    { id: "music", name: "Music" },
    { id: "sports", name: "Sports" },
    { id: "conference", name: "Conference" },
    { id: "exhibition", name: "Exhibition" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and book tickets for the best events near you
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, artists, or venues..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="sm:w-auto w-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            className="sm:w-auto w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <motion.div 
            className="mt-4 p-6 border rounded-lg bg-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Price Range (ETH)</h3>
                <Slider 
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={0} 
                  max={1} 
                  step={0.01} 
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>{priceRange[0]} ETH</span>
                  <span>{priceRange[1]} ETH</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Location</h3>
                <div className="space-y-2">
                  {["New York", "Los Angeles", "Miami", "San Francisco", "Austin"].map((city) => (
                    <div className="flex items-center space-x-2\" key={city}>
                      <Checkbox id={`city-${city}`} />
                      <Label htmlFor={`city-${city}`}>{city}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Additional Filters</h3>
                <div className="space-y-2">
                  {[
                    "Available tickets only", 
                    "Verified organizers", 
                    "Free events", 
                    "New listings"
                  ].map((filter) => (
                    <div className="flex items-center space-x-2\" key={filter}>
                      <Checkbox id={`filter-${filter}`} />
                      <Label htmlFor={`filter-${filter}`}>{filter}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="mr-2">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="all" className="w-full mt-8" onValueChange={setCategory}>
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div 
                    key={i}
                    className="h-[360px] rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : filteredEvents?.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="text-2xl font-medium">No events found</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button 
                  className="mt-6" 
                  onClick={() => {
                    setSearchQuery("");
                    setCategory("all");
                    setDate(undefined);
                    setPriceRange([0, 0.5]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents?.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}