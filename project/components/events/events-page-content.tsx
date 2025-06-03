"use client";

import { useState } from "react";
import { useEventsQuery } from "@/hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export function EventsPageContent() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useEventsQuery(false);
  console.log('Events page - events:', events, 'isLoading:', isLoading);

  // Filter events based on search and category
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and book tickets for the best events near you
        </p>

        <div className="mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, artists, or venues..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
              null
            ) : filteredEvents?.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="text-2xl font-medium">No events right now.</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  There are currently no events to display. Please check back later or create a new event.
                </p>
                <Button
                  className="mt-6"
                  asChild
                >
                  <a href="/events/create">Create Event</a>
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