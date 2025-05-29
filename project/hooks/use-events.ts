"use client";

import { useQuery } from "@tanstack/react-query";
import { EventType } from "@/types/events";

// Mock events data - in a real application, this would come from your API/blockchain
const MOCK_EVENTS: EventType[] = [
  {
    id: "1",
    name: "Crypto Music Festival 2025",
    description: "The biggest blockchain music festival of the year",
    date: new Date("2025-07-15T18:00:00"),
    location: "Miami, FL",
    price: 0.05,
    currency: "ETH",
    maxTickets: 1000,
    remainingTickets: 650,
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    organizer: "0x1234567890123456789012345678901234567890",
    category: "music",
    tags: ["music", "festival", "crypto"],
  },
  {
    id: "2",
    name: "Blockchain Developer Conference",
    description: "Annual conference for blockchain developers",
    date: new Date("2025-08-10T09:00:00"),
    location: "San Francisco, CA",
    price: 0.1,
    currency: "ETH",
    maxTickets: 500,
    remainingTickets: 203,
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    organizer: "0x1234567890123456789012345678901234567890",
    category: "conference",
    tags: ["tech", "blockchain", "developers"],
  },
  {
    id: "3",
    name: "Crypto NBA All-Star Game",
    description: "Special NBA game with NFT ticket holders perks",
    date: new Date("2025-02-15T19:30:00"),
    location: "Los Angeles, CA",
    price: 0.15,
    currency: "ETH",
    maxTickets: 20000,
    remainingTickets: 8542,
    image: "https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    organizer: "0x1234567890123456789012345678901234567890",
    category: "sports",
    tags: ["sports", "basketball", "nba"],
  },
  {
    id: "4",
    name: "Digital Art Exhibition",
    description: "Exclusive NFT art exhibition featuring top artists",
    date: new Date("2025-09-05T11:00:00"),
    location: "New York, NY",
    price: 0.03,
    currency: "ETH",
    maxTickets: 300,
    remainingTickets: 124,
    image: "https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    organizer: "0x1234567890123456789012345678901234567890",
    category: "exhibition",
    tags: ["art", "nft", "digital"],
  },
  {
    id: "5",
    name: "Web3 Summit",
    description: "Global summit for Web3 enthusiasts and developers",
    date: new Date("2025-10-22T10:00:00"),
    location: "Berlin, Germany",
    price: 0.08,
    currency: "ETH",
    maxTickets: 1500,
    remainingTickets: 872,
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    organizer: "0x1234567890123456789012345678901234567890",
    category: "conference",
    tags: ["web3", "blockchain", "developers"],
  },
  {
    id: "6",
    name: "Decentralized Comedy Night",
    description: "Stand-up comedy show for crypto enthusiasts",
    date: new Date("2025-05-30T20:00:00"),
    location: "Austin, TX",
    price: 0.02,
    currency: "ETH",
    maxTickets: 200,
    remainingTickets: 43,
    image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    organizer: "0x1234567890123456789012345678901234567890",
    category: "music",
    tags: ["comedy", "entertainment", "crypto"],
  },
];

// Function to fetch events - in a production app, this would call your API
const fetchEvents = async (): Promise<EventType[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return MOCK_EVENTS;
};

export function useEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
}

export function useEventQuery(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const event = MOCK_EVENTS.find(e => e.id === id);
      if (!event) throw new Error(`Event with id ${id} not found`);
      return event;
    },
  });
}