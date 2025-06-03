import { EventDetailContent } from "@/components/events/event-detail-content";
import { Metadata } from "next";
import { TicketList } from '../../../components/TicketList';
import { ethers } from "ethers";
import { EVENT_CONTRACT_ABI, EVENT_CONTRACT_ADDRESS } from "@/lib/contracts";

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

export async function generateStaticParams() {
  // Use a public RPC provider (e.g., Alchemy, Infura, or a public node)
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo");
  const contract = new ethers.Contract(
    EVENT_CONTRACT_ADDRESS,
    EVENT_CONTRACT_ABI,
    provider
  );
  let ids: string[] = [];
  try {
    const eventIds: bigint[] = await contract.getAllEvents();
    ids = eventIds.map(id => id.toString());
  } catch (e) {
    // fallback: no events
    ids = [];
  }
  return ids.map(id => ({ id }));
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = params;

  return (
    <div className="container mx-auto py-8">
      <EventDetailContent id={id} />
    </div>
  );
}