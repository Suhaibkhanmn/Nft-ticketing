export interface EventType {
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
}

export interface TicketType {
  id: string;
  eventId: string;
  owner: string;
  event: EventType;
  purchaseDate: Date;
  price: number;
  currency: string;
  forSale: boolean;
  resalePrice?: number;
  seat?: string;
  metadata?: {
    [key: string]: any;
  }
}