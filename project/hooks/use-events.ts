"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWeb3 } from "@/providers/web3-provider";
import { getEventContract, getTicketContract } from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

export type EventType = {
  id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  currency: string;
  maxTickets: number;
  remainingTickets: number;
  image: string;
  organizer: string;
  category: string;
  tags: string[];
};

// Function to fetch events from the contract
const fetchEvents = async (signer: ethers.Signer): Promise<EventType[]> => {
  const eventContract = getEventContract(signer);
  const eventIds = await eventContract.getAllEvents();
  console.log('Fetched eventIds:', eventIds.map((e: any) => e.toString()));

  const events: EventType[] = [];
  for (const eventId of eventIds) {
    console.log('Trying eventId:', eventId.toString());
    try {
      if (eventId.toString() === "0") continue;
      const event = await eventContract.getEventDetails(eventId.toString());
      console.log('Fetched event:', event);
      if (!event.name || event.id.toString() === "0") continue;
      events.push({
        id: event.id.toString(),
        name: event.name,
        description: event.description,
        date: new Date(Number(event.date) * 1000),
        location: event.location,
        price: Number(ethers.formatEther(event.price)),
        currency: "ETH",
        maxTickets: Number(event.maxTickets),
        remainingTickets: Number(event.maxTickets) - Number(event.ticketsSold),
        image: event.image || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        organizer: event.creator,
        category: "music",
        tags: ["event", "nft"],
      });
    } catch (err) {
      console.error('Error fetching eventId', eventId.toString(), err);
      continue;
    }
  }
  console.log('Final events array:', events);
  return events.sort((a, b) => Number(b.id) - Number(a.id));
};

export function useEventsQuery(filterByCreator: boolean = false) {
  const { wallet } = useWeb3();

  return useQuery({
    queryKey: ['events', filterByCreator, wallet.address],
    queryFn: async () => {
      if (!wallet.signer || !wallet.address) throw new Error("Wallet not connected");
      const eventContract = getEventContract(wallet.signer);
      const eventIds = filterByCreator
        ? await eventContract.getCreatorEvents(wallet.address)
        : await eventContract.getAllEvents();

      const events: EventType[] = [];
      for (const eventId of eventIds) {
        try {
          if (eventId.toString() === "0") continue;
          const event = await eventContract.getEventDetails(eventId.toString());
          if (!event.name || event.id.toString() === "0") continue;

          // If filtering by creator, only include events created by the current user
          if (filterByCreator && event.creator.toLowerCase() !== wallet.address.toLowerCase()) continue;

          events.push({
            id: event.id.toString(),
            name: event.name,
            description: event.description,
            date: new Date(Number(event.date) * 1000),
            location: event.location,
            price: Number(ethers.formatEther(event.price)),
            currency: "ETH",
            maxTickets: Number(event.maxTickets),
            remainingTickets: Number(event.maxTickets) - Number(event.ticketsSold),
            image: event.image || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            organizer: event.creator,
            category: "music",
            tags: ["event", "nft"],
          });
        } catch (err) {
          console.error('Error fetching eventId', eventId.toString(), err);
          continue;
        }
      }
      return events.sort((a, b) => Number(b.id) - Number(a.id));
    },
    enabled: !!wallet.signer && !!wallet.address,
  });
}

export function useEventQuery(id: string) {
  const { wallet } = useWeb3();

  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!wallet.signer) throw new Error("Wallet not connected");
      const eventContract = getEventContract(wallet.signer);
      const event = await eventContract.getEventDetails(id);
      return {
        id: event.id.toString(),
        name: event.name,
        description: event.description,
        date: new Date(Number(event.date) * 1000),
        location: event.location,
        price: Number(ethers.formatEther(event.price)),
        currency: "ETH",
        maxTickets: Number(event.maxTickets),
        remainingTickets: Number(event.maxTickets) - Number(event.ticketsSold),
        image: event.image || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        organizer: event.creator,
        category: "music",
        tags: ["event", "nft"],
      };
    },
    enabled: !!wallet.signer,
  });
}

export function usePurchaseTicket() {
  const { wallet } = useWeb3();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, price, quantity }: { eventId: string; price: number; quantity: number }) => {
      if (!wallet.signer) throw new Error("Wallet not connected");
      const ticketContract = getTicketContract(wallet.signer);
      // Call bulkMintTickets for multiple tickets
      const tx = await ticketContract.bulkMintTickets(eventId, quantity, {
        value: ethers.parseEther(price.toString()),
      });
      await tx.wait();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Success",
        description: "Ticket(s) purchased successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to purchase ticket(s)",
        variant: "destructive",
      });
    },
  });
}

export function useTransferTicket() {
  const { wallet } = useWeb3();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, ticketId, to }: { eventId: string; ticketId: string; to: string }) => {
      if (!wallet.signer) throw new Error("Wallet not connected");
      const eventContract = getEventContract(wallet.signer);

      const tx = await eventContract.transferTicket(eventId, ticketId, to);
      await tx.wait();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Success",
        description: "Ticket transferred successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to transfer ticket",
        variant: "destructive",
      });
    },
  });
}

export function useMyEventsQuery() {
  const { wallet } = useWeb3();
  return useQuery({
    queryKey: ['my-events', wallet.address],
    queryFn: async () => {
      if (!wallet.signer || !wallet.address) throw new Error("Wallet not connected");
      const eventContract = getEventContract(wallet.signer);
      const eventIds = await eventContract.getCreatorEvents(wallet.address);
      const events = await Promise.all(
        eventIds.map(async (eventId: bigint) => {
          try {
            const event = await eventContract.getEventDetails(eventId.toString());
            if (!event.name || event.id.toString() === "0") return null;
            // Only include if organizer matches the connected wallet
            if (event.creator.toLowerCase() !== (wallet.address as string).toLowerCase()) return null;
            return {
              id: event.id.toString(),
              name: event.name,
              description: event.description,
              date: new Date(Number(event.date) * 1000),
              location: event.location,
              price: Number(ethers.formatEther(event.price)),
              currency: "ETH",
              maxTickets: Number(event.maxTickets),
              remainingTickets: Number(event.maxTickets) - Number(event.ticketsSold),
              image: event.image || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
              organizer: event.creator,
              category: "music",
              tags: ["event", "nft"],
            };
          } catch (err) {
            // If the call reverts, skip this eventId
            return null;
          }
        })
      );
      return events.filter(e => e && e.id !== "0").sort((a, b) => Number(b.id) - Number(a.id));
    },
    enabled: !!wallet.signer && !!wallet.address,
  });
}