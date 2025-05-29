import { Metadata } from "next";
import { CreateEventForm } from "@/components/events/create-event-form";

export const metadata: Metadata = {
  title: "Create Event | NFT Ticketing System",
  description: "Create a new event and mint NFT tickets",
};

export default function CreateEventPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">Create New Event</h1>
      <p className="text-muted-foreground mb-8">
        Fill out the details below to create your event and mint NFT tickets
      </p>
      
      <CreateEventForm />
    </div>
  );
}