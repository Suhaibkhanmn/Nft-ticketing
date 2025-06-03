"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, MoreHorizontal, Send, Tag, QrCode, Users } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useWeb3 } from "@/providers/web3-provider";
import { getEventContract, getTicketContract } from "@/lib/contracts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";

type Ticket = {
  id: string;
  eventId: string;
  event: {
    id: string;
    name: string;
    description: string;
    date: Date;
    location: string;
    image: string;
    category: string;
  };
  purchaseDate: Date;
  price: number;
  currency: string;
  forSale: boolean;
  resalePrice?: number;
};

export function MyTicketsTab() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const { toast } = useToast();
  const { wallet } = useWeb3();
  const queryClient = useQueryClient();
  const [isTransferring, setIsTransferring] = useState(false);
  const [ticketsState, setTicketsState] = useState<Ticket[] | null>(null);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets', wallet.address],
    queryFn: async () => {
      if (!wallet.signer) throw new Error("Wallet not connected");

      const ticketContract = getTicketContract(wallet.signer);
      const eventContract = getEventContract(wallet.signer);

      // Always use the connected wallet address
      const ticketIds: bigint[] = await ticketContract.getUserTickets(wallet.address!);
      console.log('Fetched ticketIds:', ticketIds);

      const tickets = await Promise.all(
        ticketIds.map(async (ticketId) => {
          // Get ticket details
          const ticket = await ticketContract.getTicketDetails(ticketId);
          // Get event details
          const event = await eventContract.getEventDetails(ticket.eventId);

          return {
            id: ticket.id.toString(),
            eventId: ticket.eventId.toString(),
            event: {
              id: event.id.toString(),
              name: event.name,
              description: event.description,
              date: new Date(Number(event.date) * 1000),
              location: event.location,
              image: event.image || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
              category: "music",
            },
            purchaseDate: new Date(),
            price: Number(ethers.formatEther(event.price)),
            currency: "ETH",
            forSale: false,
          };
        })
      );
      console.log('Fetched tickets:', tickets);

      return tickets;
    },
    enabled: !!wallet.signer && !!wallet.address,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  // Use ticketsState if set, otherwise use fetched tickets
  const displayedTickets = ticketsState ?? tickets;

  const upcomingTickets = displayedTickets?.filter(
    ticket => new Date(ticket.event.date) > new Date()
  ) ?? [];

  const pastTickets = displayedTickets?.filter(
    ticket => new Date(ticket.event.date) <= new Date()
  ) ?? [];

  const handleTransfer = async () => {
    if (!selectedTicket || !wallet.signer || !transferAddress) return;

    setIsTransferring(true);
    try {
      const ticketContract = getTicketContract(wallet.signer);

      // Validate address format
      if (!ethers.isAddress(transferAddress)) {
        throw new Error("Invalid recipient address");
      }

      // Check ownership
      const owner = await ticketContract.ownerOf(BigInt(selectedTicket.id));
      if (owner.toLowerCase() !== wallet.address?.toLowerCase()) {
        throw new Error(`Ownership mismatch. Contract owner: ${owner}, Your address: ${wallet.address}`);
      }

      const tx = await ticketContract.transferTicket(
        BigInt(selectedTicket.id),
        transferAddress
      );
      await tx.wait();

      // Optimistically remove the ticket from the sender's dashboard
      setTicketsState((prev) => (prev ? prev.filter(t => t.id !== selectedTicket.id) : null));

      // Optionally, trigger a refetch for the receiver's tickets if they are using the app
      await queryClient.invalidateQueries({ queryKey: ['tickets', transferAddress] });

      toast({
        title: "Success",
        description: `Ticket transferred from ${wallet.address} to ${transferAddress}!`,
      });
      setShowTransferModal(false);
      setTransferAddress("");
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transfer ticket",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleListForSale = async (price: number) => {
    if (!selectedTicket || !wallet.signer) return;

    try {
      const eventContract = getEventContract(wallet.signer);
      const tx = await eventContract.listTicketForSale(
        selectedTicket.eventId,
        selectedTicket.id,
        ethers.parseEther(price.toString())
      );
      await tx.wait();

      toast({
        title: "Success",
        description: "Ticket listed for sale successfully!",
      });
      setShowSellModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list ticket for sale",
        variant: "destructive",
      });
    }
  };

  // Manual Refresh Button
  const handleRefreshTickets = async () => {
    setTicketsState(null); // Clear local state so next render uses fresh query
    await queryClient.invalidateQueries({ queryKey: ['tickets', wallet.address] });
    toast({ title: 'Refetch triggered', description: 'Manually triggered ticket refetch.' });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[360px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Manual Refresh Button */}
      <div className="mb-4 flex gap-2">
        <Button onClick={handleRefreshTickets}>
          Refresh Tickets
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingTickets.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Upcoming Tickets</h3>
              <p className="text-muted-foreground mt-2 mb-6">You don't have any tickets for upcoming events.</p>
              <Button asChild>
                <a href="/events">Browse Events</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onSelect={setSelectedTicket}
                  onShowTransfer={() => {
                    setSelectedTicket(ticket);
                    setShowTransferModal(true);
                  }}
                  onShowSell={() => {
                    setSelectedTicket(ticket);
                    setShowSellModal(true);
                  }}
                  onShowQr={() => {
                    setSelectedTicket(ticket);
                    setShowQrModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastTickets.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Past Events</h3>
              <p className="text-muted-foreground mt-2">You haven't attended any events yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isPast
                  onSelect={setSelectedTicket}
                  onShowQr={() => {
                    setSelectedTicket(ticket);
                    setShowQrModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketplace" className="mt-6">
          <div className="text-center py-16">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Marketplace Coming Soon</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Our ticket marketplace is under development. Stay tuned!
            </p>
            <Button variant="outline" asChild>
              <a href="/events">Browse Events</a>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Ticket</DialogTitle>
            <DialogDescription>
              Enter the recipient's wallet address to transfer your ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              placeholder="0x..."
              className="w-full p-2 border rounded"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
              disabled={isTransferring}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferModal(false)} disabled={isTransferring}>
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!transferAddress || isTransferring}
            >
              {isTransferring ? "Transferring..." : "Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Modal */}
      <Dialog open={showSellModal} onOpenChange={setShowSellModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Ticket for Sale</DialogTitle>
            <DialogDescription>
              Set your desired price for the ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="number"
              placeholder="0.0"
              className="w-full p-2 border rounded"
              onChange={(e) => {
                // Handle price input
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSellModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleListForSale(0.1)}>
              List for Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket QR Code</DialogTitle>
            <DialogDescription>
              Show this QR code at the event entrance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            {selectedTicket && (
              <QRCodeSVG
                value={`${selectedTicket.eventId}-${selectedTicket.id}`}
                size={200}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQrModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TicketCardProps {
  ticket: Ticket;
  isPast?: boolean;
  onSelect: (ticket: Ticket) => void;
  onShowTransfer?: () => void;
  onShowSell?: () => void;
  onShowQr: () => void;
}

function TicketCard({ ticket, isPast = false, onShowTransfer, onShowSell, onShowQr }: TicketCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={ticket.event.image}
          alt={ticket.event.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="backdrop-blur-sm bg-background/70">
            {ticket.event.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{ticket.event.name}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(ticket.event.date, "MMM d, yyyy")}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {format(ticket.event.date, "h:mm a")}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {ticket.event.location}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t bg-muted/30">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm">
            <span className="text-muted-foreground">Ticket ID: </span>
            <span className="font-medium">{ticket.id}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onShowQr}>
                <QrCode className="mr-2 h-4 w-4" />
                Show QR Code
              </DropdownMenuItem>
              {!isPast && onShowTransfer && (
                <DropdownMenuItem onClick={onShowTransfer}>
                  <Send className="mr-2 h-4 w-4" />
                  Transfer Ticket
                </DropdownMenuItem>
              )}
              {!isPast && onShowSell && (
                <DropdownMenuItem onClick={onShowSell}>
                  <Tag className="mr-2 h-4 w-4" />
                  List for Sale
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}