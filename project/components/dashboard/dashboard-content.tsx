"use client";

import { useState } from "react";
import { useWeb3 } from "@/providers/web3-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MyEventsTab } from "@/components/dashboard/my-events-tab";
import { MyTicketsTab } from "@/components/dashboard/my-tickets-tab";
import { Wallet, Ticket, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getEventContract, getTicketContract } from "@/lib/contracts";
import { ethers } from "ethers";

export function DashboardContent() {
  const { wallet, connect } = useWeb3();

  // Real-time tickets owned
  const { data: ticketCount } = useQuery({
    queryKey: ["ticketCount", wallet.address],
    queryFn: async () => {
      if (!wallet.signer || !wallet.address) return 0;
      const ticketContract = getTicketContract(wallet.signer);
      const ticketIds: bigint[] = await ticketContract.getUserTickets(wallet.address);
      return ticketIds.length;
    },
    enabled: !!wallet.signer && !!wallet.address,
  });

  // Real-time events created
  const { data: eventCount } = useQuery({
    queryKey: ["eventCount", wallet.address],
    queryFn: async () => {
      if (!wallet.signer || !wallet.address) return 0;
      const eventContract = getEventContract(wallet.signer);
      const eventIds: bigint[] = await eventContract.getCreatorEvents(wallet.address);
      return eventIds.length;
    },
    enabled: !!wallet.signer && !!wallet.address,
  });
  console.log('eventCount:', eventCount);

  if (!wallet.isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Connect your wallet to view your dashboard, manage your events and tickets
          </p>
          <Button size="lg" onClick={connect} disabled={wallet.isConnecting}>
            {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {wallet.address?.substring(2, 4)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wallet.balance ? `${Number(wallet.balance).toFixed(4)} ETH` : "Loading..."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Owned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ticketCount !== undefined ? ticketCount : "Loading..."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Events Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventCount !== undefined ? eventCount : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="mb-8 h-auto p-1 sm:h-10">
          <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Ticket className="mr-2 h-4 w-4" />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            My Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <MyTicketsTab />
        </TabsContent>

        <TabsContent value="events">
          <MyEventsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}