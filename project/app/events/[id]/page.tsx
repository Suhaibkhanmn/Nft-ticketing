import { EventDetailContent } from "@/components/events/event-detail-content";
import { Metadata } from "next";

type EventPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  // In a production app, fetch event data from API/blockchain
  return {
    title: "Event Details | NFT Ticketing System",
    description: "Details about this event and ticket purchase options",
  };
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = params;
  
  return <EventDetailContent id={id} />;
}