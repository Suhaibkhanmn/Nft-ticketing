"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "NFTix transformed how we sell tickets. No more fraud and we earn royalties on resales!",
      author: "Sarah Johnson",
      title: "Event Organizer",
      image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "I love how easy it is to buy, sell, or transfer tickets. The transparency is amazing!",
      author: "Michael Chen",
      title: "Concert Goer",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "As a venue owner, the analytics and ticket verification features are game-changing.",
      author: "Alex Rodriguez",
      title: "Venue Manager",
      image: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  return (
    <section className="py-12">
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-center mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        What People Are Saying
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <svg width="45" height="36" className="text-muted-foreground/40" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.95 36L0 24.75V13.5L13.95 0H25.2V24.75H13.95V36ZM33.75 36L19.8 24.75V13.5L33.75 0H45V24.75H33.75V36Z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  <p className="flex-1 text-lg mb-8">{testimonial.quote}</p>
                  
                  <div className="flex items-center mt-auto">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}