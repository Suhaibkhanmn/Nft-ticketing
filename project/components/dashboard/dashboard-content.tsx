"use client";

import { useState } from "react";
import { useWeb3 } from "@/providers/web3-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { MyEventsTab } from "@/components/dashboard/my-events-tab";
import { MyTicketsTab } from "@/components/dashboard/my-tickets-tab";
import { UserProfileSection } from "@/components/dashboard/user-profile-section";
import { Wallet, Ticket, Calendar, BarChart3, ArrowRight } from "lucide-react";

export function DashboardContent() {
  const { wallet, connect } = useWeb3();
  
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Events Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.45 ETH</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
            <CardDescription>Your event ticket sales and activity</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Event performance chart will be displayed here</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded">
                  <div className="bg-primary/10 rounded p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Crypto Music Festival</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Jul 15, 2025
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <a href="/events">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
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
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets">
          <MyTicketsTab />
        </TabsContent>
        
        <TabsContent value="events">
          <MyEventsTab />
        </TabsContent>
        
        <TabsContent value="profile">
          <UserProfileSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}