"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWeb3 } from "@/providers/web3-provider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Clock, Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  date: z.date(),
  time: z.string(),
  category: z.string(),
  maxTickets: z.number().min(1, "You must offer at least 1 ticket"),
  price: z.number().min(0, "Price must be at least 0"),
  imageUrl: z.string().optional(),
  tags: z.string(),
  advancedOptions: z.object({
    resellable: z.boolean().default(true),
    transferable: z.boolean().default(true),
    maxResellPrice: z.number().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateEventForm() {
  const { wallet, connect } = useWeb3();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      date: new Date(),
      time: "18:00",
      category: "",
      maxTickets: 100,
      price: 0.05,
      tags: "",
      advancedOptions: {
        resellable: true,
        transferable: true,
      },
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        form.setValue("imageUrl", URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!wallet.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create an event",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      toast({
        title: "Event Created Successfully!",
        description: "Your event has been created and tickets are ready to be minted",
      });
      
      // Redirect to event page (in a real app, would redirect to the newly created event)
      router.push("/events");
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "There was an error creating your event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!wallet.isConnected) {
    return (
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              You need to connect your wallet to create an event and mint NFT tickets
            </p>
            <Button size="lg" onClick={connect} disabled={wallet.isConnecting}>
              {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center font-medium ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-10 sm:w-20 ${
                    currentStep > step ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid gap-6">
              <h2 className="text-2xl font-semibold">Basic Information</h2>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your event" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="exhibition">Exhibition</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Event venue or location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <Clock className="ml-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="time" 
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. music, festival, jazz (comma separated)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add tags to help attendees find your event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="button" onClick={() => setCurrentStep(2)}>
                  Next Step
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Ticket Information */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid gap-6">
              <h2 className="text-2xl font-semibold">Ticket Information</h2>
              
              <FormField
                control={form.control}
                name="maxTickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Tickets</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      The total number of tickets available for your event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Ticket (ETH)</FormLabel>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        defaultValue={[field.value]}
                        onValueChange={value => field.onChange(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between items-center">
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            className="max-w-[150px]"
                          />
                        </FormControl>
                        <span className="text-sm font-medium">ETH</span>
                      </div>
                    </div>
                    <FormDescription>
                      Set to 0 for free tickets
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Advanced Options</h3>
                
                <FormField
                  control={form.control}
                  name="advancedOptions.transferable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <FormLabel className="text-base">Transferable</FormLabel>
                        <FormDescription>
                          Allow ticket holders to transfer their tickets to others
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="advancedOptions.resellable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <FormLabel className="text-base">Resellable</FormLabel>
                        <FormDescription>
                          Allow ticket holders to resell their tickets on the marketplace
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("advancedOptions.resellable") && (
                  <FormField
                    control={form.control}
                    name="advancedOptions.maxResellPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Resell Price Multiplier</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="e.g. 2 for 2x original price"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Set a limit on how much tickets can be resold for (as a multiple of the original price)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  Previous Step
                </Button>
                <Button type="button" onClick={() => setCurrentStep(3)}>
                  Next Step
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Upload Image & Preview */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid gap-6">
              <h2 className="text-2xl font-semibold">Event Image & Preview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <FormItem>
                    <FormLabel>Event Image</FormLabel>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="event-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="event-image" className="cursor-pointer block">
                        {previewImage ? (
                          <div className="relative h-48 w-full mb-4">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="h-full w-full object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-4">
                            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground mb-1">
                              Click or drag and drop to upload
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, or GIF (max. 5MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                    <FormDescription>
                      This image will be shown on your event listing and ticket
                    </FormDescription>
                  </FormItem>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Event Preview</h3>
                  <Card className="overflow-hidden">
                    <div className="relative h-36 w-full">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">No image uploaded</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold truncate">
                        {form.watch("name") || "Event Name"}
                      </h4>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(form.watch("date"), "MMM d, yyyy")} • {form.watch("time")}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {form.watch("location") || "Event Location"}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {form.watch("price")} ETH
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg mt-4">
                <h3 className="font-medium mb-2">Summary</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Event Name:</div>
                  <div>{form.watch("name")}</div>
                  
                  <div>Date & Time:</div>
                  <div>{format(form.watch("date"), "PPP")} at {form.watch("time")}</div>
                  
                  <div>Location:</div>
                  <div>{form.watch("location")}</div>
                  
                  <div>Category:</div>
                  <div className="capitalize">{form.watch("category")}</div>
                  
                  <div>Tickets Available:</div>
                  <div>{form.watch("maxTickets")}</div>
                  
                  <div>Price per Ticket:</div>
                  <div>{form.watch("price")} ETH</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  Previous Step
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Event..." : "Create Event"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </Form>
  );
}