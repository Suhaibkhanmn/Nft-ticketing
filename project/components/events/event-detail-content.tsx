"use client";

import { useState } from "react";
import { useEventQuery, usePurchaseTicket } from "@/hooks/use-events";
import { useWeb3 } from "@/providers/web3-provider";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Ticket, Share2, Heart, Info, AlertCircle, ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EventDetailContentProps {
  id: string;
}

export function EventDetailContent({ id }: EventDetailContentProps) {
  const { data: event, isLoading } = useEventQuery(id);
  const { wallet, connect } = useWeb3();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();
  const purchaseTicket = usePurchaseTicket();

  // Handle purchase using contract
  const handlePurchase = async () => {
    if (!wallet.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase tickets",
        variant: "destructive",
      });
      return;
    }
    if (!event) {
      toast({
        title: "Event Not Loaded",
        description: "Event data is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setIsPurchasing(true);
    try {
      await purchaseTicket.mutateAsync({
        eventId: event.id,
        price: event.price * ticketQuantity,
        quantity: ticketQuantity,
      });
      toast({
        title: "Purchase Successful!",
        description: `You've successfully purchased ${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''} for ${event.name}`,
      });
      setShowPurchaseModal(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  // Handle share
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  // Handle favorite
  const handleFavorite = () => {
    setIsFavorited((fav) => !fav);
    toast({ title: isFavorited ? "Removed from favorites" : "Added to favorites" });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/events" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-10 w-3/4 mt-6" />
            <Skeleton className="h-4 w-1/2 mt-4" />
            <Skeleton className="h-4 w-full mt-6" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">Event Not Found</h1>
        <p className="text-muted-foreground mt-2">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  const formattedDate = format(event.date, "EEEE, MMMM d, yyyy");
  const formattedTime = format(event.date, "h:mm a");

  const totalCost = event.price * ticketQuantity;
  const maxQuantity = Math.min(event.remainingTickets, 10); // Limit to 10 tickets per purchase

  // Calculate ticket availability percentage
  const availabilityPercentage = (event.remainingTickets / event.maxTickets) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/events" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
              <Image
                src={event.image}
                alt={event.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="outline">{event.category}</Badge>
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mt-6">{event.name}</h1>

            <div className="flex flex-wrap gap-6 mt-6 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                {formattedTime}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                {event.maxTickets} capacity
              </div>
            </div>

            <Tabs defaultValue="details" className="mt-10">
              <TabsList>
                <TabsTrigger value="details">Event Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="organizer">Organizer</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg">{event.description}</p>
                  <h3>About This Event</h3>
                  <p>
                    Join us for an unforgettable experience at {event.name}. This event will feature amazing performances,
                    networking opportunities, and much more. Your NFT ticket gives you access to all areas of the event,
                    as well as exclusive perks only available to ticket holders.
                  </p>
                  <h3>What to Expect</h3>
                  <ul>
                    <li>Exclusive access to all areas of the event</li>
                    <li>Special meet-and-greet opportunities</li>
                    <li>Digital collectibles and memorabilia</li>
                    <li>Unique NFT ticket that can be kept as a souvenir</li>
                  </ul>
                  <p>
                    Don't miss this opportunity to be part of an innovative event experience powered by blockchain technology.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="location">
                <div className="h-[400px] bg-muted rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Interactive map will be displayed here</p>
                  </div>
                </div>
                <h3 className="text-xl font-medium mt-4">Getting There</h3>
                <p className="mt-2 text-muted-foreground">
                  Detailed information about the venue location, parking options, and public transportation access.
                </p>
              </TabsContent>
              <TabsContent value="organizer">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarFallback>OG</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">Event Organizer</h3>
                    <p className="text-muted-foreground mt-1">Verified organizer</p>
                    <p className="text-sm mt-2 font-mono">{event.organizer.substring(0, 8)}...{event.organizer.substring(36)}</p>
                  </div>
                </div>
                <div className="mt-6 prose dark:prose-invert max-w-none">
                  <p>
                    This organizer has created multiple successful events on our platform.
                    Their events are known for excellent organization and unique experiences.
                  </p>
                  <Button variant="outline" className="mt-4">View Organizer Profile</Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant={isFavorited ? "default" : "outline"} size="icon" onClick={handleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorited ? "text-red-500 fill-red-500" : ""}`} />
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
              <CardDescription>Secure your spot at this event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Price</span>
                    <span className="font-semibold">{event.price} {event.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>Service fee</span>
                    <span>0.002 {event.currency}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Availability</span>
                    <span>{event.remainingTickets} of {event.maxTickets}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2 overflow-hidden">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${availabilityPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg text-sm flex items-center">
                  <Info className="h-5 w-5 mr-3 text-primary shrink-0" />
                  <p>This ticket is an NFT that will be sent to your connected wallet address after purchase.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowPurchaseModal(true)}
                disabled={event.remainingTickets === 0}
              >
                <Ticket className="mr-2 h-5 w-5" />
                {event.remainingTickets === 0 ? "Sold Out" : "Purchase Ticket"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase Tickets</DialogTitle>
            <DialogDescription>
              You're about to purchase NFT tickets for {event.name}
            </DialogDescription>
          </DialogHeader>

          {!wallet.isConnected ? (
            <div className="py-6 flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">Wallet Not Connected</h3>
              <p className="text-center text-muted-foreground mt-2 mb-4">
                You need to connect your wallet first to purchase tickets
              </p>
              <Button onClick={connect} disabled={wallet.isConnecting}>
                {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quantity" className="text-base">
                    Number of tickets
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{ticketQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setTicketQuantity(Math.min(maxQuantity, ticketQuantity + 1))}
                      disabled={ticketQuantity >= maxQuantity}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between mb-1">
                    <span>Price per ticket:</span>
                    <span>{event.price} {event.currency}</span>
                  </div>
                  <div className="flex justify-between mb-1 text-sm text-muted-foreground">
                    <span>Service fee:</span>
                    <span>0.002 {event.currency}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>{(event.price * ticketQuantity).toFixed(3)} {event.currency}</span>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded text-sm mt-2 flex">
                  <Info className="h-5 w-5 mr-2 shrink-0" />
                  <p>
                    By purchasing, you agree to our terms and understand that this NFT ticket
                    will be minted directly to your connected wallet address.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePurchase} disabled={isPurchasing}>
                  {isPurchasing ? "Processing..." : "Confirm Purchase"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}