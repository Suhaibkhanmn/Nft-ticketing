"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWeb3 } from "@/providers/web3-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { User, Bell, Key, Shield, Copy, CheckCheck } from "lucide-react";

export function UserProfileSection() {
  const { wallet } = useWeb3();
  const [isEditing, setIsEditing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl">
                  {wallet.address?.substring(2, 4)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium">Web3 User</h3>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <span className="font-mono">
                    {wallet.address?.substring(0, 6)}...{wallet.address?.substring(38)}
                  </span>
                  <button 
                    onClick={copyAddress} 
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    {copiedAddress ? (
                      <CheckCheck className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant={isEditing ? "outline" : "default"} 
                onClick={() => setIsEditing(!isEditing)} 
                className="w-full"
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </Button>
              
              <div className="p-4 bg-muted/50 rounded-lg text-sm">
                <h4 className="font-medium mb-2">Wallet Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span>Ethereum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance:</span>
                    <span>{wallet.balance ? `${Number(wallet.balance).toFixed(4)} ETH` : "Loading..."}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connected:</span>
                    <span>Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-8">
          <Tabs defaultValue="account">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="account">
                <User className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="First Name" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Last Name" disabled={!isEditing} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="email@example.com" disabled={!isEditing} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Display Name</Label>
                      <Input id="username" placeholder="Username" disabled={!isEditing} />
                    </div>
                    
                    {isEditing && (
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your profile visibility and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Public Profile</h4>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your profile and collection
                        </p>
                      </div>
                      <Switch disabled={!isEditing} defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Tickets on Profile</h4>
                        <p className="text-sm text-muted-foreground">
                          Display your ticket collection publicly
                        </p>
                      </div>
                      <Switch disabled={!isEditing} defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Events Created</h4>
                        <p className="text-sm text-muted-foreground">
                          Display events you've organized on your profile
                        </p>
                      </div>
                      <Switch disabled={!isEditing} defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your tickets and events
                        </p>
                      </div>
                      <Switch disabled={!isEditing} defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Price Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified when ticket prices change
                        </p>
                      </div>
                      <Switch disabled={!isEditing} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Event Reminders</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders before your events
                        </p>
                      </div>
                      <Switch disabled={!isEditing} defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and events
                        </p>
                      </div>
                      <Switch disabled={!isEditing} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" disabled={!isEditing}>
                        <Key className="mr-2 h-4 w-4" />
                        Setup
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Transaction Confirmations</h4>
                        <p className="text-sm text-muted-foreground">
                          Require confirmation for all transactions
                        </p>
                      </div>
                      <Switch disabled={!isEditing} defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Activity Log</h4>
                        <p className="text-sm text-muted-foreground">
                          View your account activity and login history
                        </p>
                      </div>
                      <Button variant="outline">
                        View Log
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg text-sm">
                      <h4 className="font-medium mb-2">Web3 Security Tips</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Never share your private keys or seed phrase</li>
                        <li>Double-check transaction details before confirming</li>
                        <li>Use a hardware wallet for large value transactions</li>
                        <li>Be cautious of phishing attempts and scams</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}