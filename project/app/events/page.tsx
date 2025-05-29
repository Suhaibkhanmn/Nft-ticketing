import { Metadata } from "next";
import { EventsPageContent } from "@/components/events/events-page-content";

export const metadata: Metadata = {
  title: "Events | NFT Ticketing System",
  description: "Discover and book tickets for upcoming events",
};

export default function EventsPage() {
  return <EventsPageContent />;
}