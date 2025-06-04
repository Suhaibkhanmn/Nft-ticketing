import { useAccount } from 'wagmi';
import { useTicketContract } from '../hooks/useTicketContract';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export function TicketList() {
    const { address } = useAccount();
    const { getUserTickets, getTicketDetails, buyTicket, listTicketForSale, claimRefund } = useTicketContract();

    const handleBuyTicket = async (ticketId: number) => {
        try {
            await buyTicket([ticketId]);
        } catch (error) {
            console.error('Error buying ticket:', error);
        }
    };

    const handleListTicket = async (ticketId: number, price: string) => {
        try {
            await listTicketForSale([ticketId, price]);
        } catch (error) {
            console.error('Error listing ticket:', error);
        }
    };

    const handleClaimRefund = async (ticketId: number) => {
        try {
            await claimRefund([ticketId]);
        } catch (error) {
            console.error('Error claiming refund:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(getUserTickets) && getUserTickets.map((ticketId: number) => (
                <Card key={ticketId}>
                    <CardHeader>
                        <CardTitle>Ticket #{ticketId}</CardTitle>
                        {/*
                        <CardDescription>
                            {typeof getTicketDetails === 'object' && getTicketDetails?.isForSale ? 'For Sale' : 'Not for Sale'}
                        </CardDescription>
                        */}
                    </CardHeader>
                    <CardContent>
                        {/*
                        <p>Price: {getTicketDetails?.(ticketId)?.price} ETH</p>
                        <p>Event ID: {getTicketDetails?.(ticketId)?.eventId}</p>
                        */}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        {/*
                        {getTicketDetails?.(ticketId)?.isForSale ? (
                            <Button onClick={() => handleBuyTicket(ticketId)}>Buy Ticket</Button>
                        ) : (
                            <Button onClick={() => handleListTicket(ticketId, '0.1')}>List for Sale</Button>
                        )}
                        */}
                        <Button variant="destructive" onClick={() => handleClaimRefund(ticketId)}>
                            Claim Refund
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
} 