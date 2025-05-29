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

// Mock tickets data
const MOCK_TICKETS = [
  {
    id: "1",
    eventId: "1",
    event: {
      id: "1",
      name: "Crypto Music Festival 2025",
      description: "The biggest blockchain music festival of the year",
      date: new Date("2025-07-15T18:00:00"),
      location: "Miami, FL",
      image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "music",
    },
    purchaseDate: new Date("2023-10-15"),
    price: 0.05,
    currency: "ETH",
    forSale: false,
  },
  {
    id: "2",
    eventId: "2",
    event: {
      id: "2",
      name: "Blockchain Developer Conference",
      description: "Annual conference for blockchain developers",
      date: new Date("2025-08-10T09:00:00"),
      location: "San Francisco, CA",
      image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "conference",
    },
    purchaseDate: new Date("2023-11-20"),
    price: 0.1,
    currency: "ETH",
    forSale: false,
  },
  {
    id: "3",
    eventId: "3",
    event: {
      id: "3",
      name: "Crypto NBA All-Star Game",
      description: "Special NBA game with NFT ticket holders perks",
      date: new Date("2025-02-15T19:30:00"),
      location: "Los Angeles, CA",
      image: "https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "sports",
    },
    purchaseDate: new Date("2023-12-01"),
    price: 0.15,
    currency: "ETH",
    forSale: true,
    resalePrice: 0.2,
  },
];

export function MyTicketsTab() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTicket, setSelectedTicket] = useState<typeof MOCK_TICKETS[0] | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();
  
  const upcomingTickets = MOCK_TICKETS.filter(
    ticket => new Date(ticket.event.date) > new Date()
  );
  
  const pastTickets = MOCK_TICKETS.filter(
    ticket => new Date(ticket.event.date) <= new Date()
  );

  const handleTransfer = () => {
    toast({
      title: "Ticket Transfer Initiated",
      description: "Transfer process has been started for your ticket",
    });
    setShowTransferModal(false);
  };

  const handleListForSale = () => {
    toast({
      title: "Ticket Listed for Sale",
      description: "Your ticket has been listed on the marketplace",
    });
    setShowSellModal(false);
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingTickets.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
              Enter the wallet address of the person you want to transfer this ticket to.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Recipient Wallet Address
              </label>
              <input
                className="w-full p-2 border rounded-md"
                placeholder="0x..."
              />
            </div>
            <div className="p-3 bg-muted rounded-md text-sm mt-2">
              <p>
                <strong>Note:</strong> This action cannot be undone. The ticket will be 
                permanently transferred to the recipient's wallet.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransfer}>
              Transfer Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Modal */}
      <Dialog open={showSellModal} onOpenChange={setShowSellModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Ticket For Sale</DialogTitle>
            <DialogDescription>
              Set your asking price for this ticket on our marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Listing Price (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                min={selectedTicket?.price || 0}
                className="w-full p-2 border rounded-md"
                placeholder="0.00"
                defaultValue={selectedTicket?.price}
              />
            </div>
            <div className="p-3 bg-muted rounded-md text-sm">
              <p>
                <strong>Original Price:</strong> {selectedTicket?.price} ETH
              </p>
              <p className="mt-1">
                <strong>Platform Fee:</strong> 2.5%
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSellModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleListForSale}>
              List For Sale
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
          <div className="py-4 flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={`ticket-id:${selectedTicket?.id}`}
                size={200}
                level="H"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-medium">{selectedTicket?.event.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ticket ID: #{selectedTicket?.id}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {format(selectedTicket?.event.date || new Date(), "PPP 'at' p")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TicketCardProps {
  ticket: typeof MOCK_TICKETS[0];
  isPast?: boolean;
  onSelect: (ticket: typeof MOCK_TICKETS[0]) => void;
  onShowTransfer?: () => void;
  onShowSell?: () => void;
  onShowQr: () => void;
}

function TicketCard({ ticket, isPast = false, onShowTransfer, onShowSell, onShowQr }: TicketCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-40 w-full">
          <Image
            src={ticket.event.image}
            alt={ticket.event.name}
            fill
            className="object-cover"
          />
          {isPast && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="secondary\" className="text-lg py-1 px-3">
                Past Event
              </Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/70">
              {ticket.event.category}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{ticket.event.name}</h3>
        </CardHeader>
        
        <CardContent className="pb-0 text-sm space-y-2 flex-1">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(ticket.event.date, "EEEE, MMMM d, yyyy")}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {format(ticket.event.date, "h:mm a")}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {ticket.event.location}
          </div>
          
          {ticket.forSale && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Listed for {ticket.resalePrice} ETH
            </Badge>
          )}
        </CardContent>
        
        <CardFooter className="pt-4 pb-4 flex justify-between">
          <Button variant="outline" size="sm" onClick={onShowQr}>
            <QrCode className="mr-2 h-4 w-4" />
            View Ticket
          </Button>
          
          {!isPast && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ticket Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onShowTransfer}>
                  <Send className="mr-2 h-4 w-4" />
                  Transfer Ticket
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShowSell}>
                  <Tag className="mr-2 h-4 w-4" />
                  {ticket.forSale ? "Update Price" : "List for Sale"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}