import { useReadContract, useWriteContract } from 'wagmi';
import { TICKET_CONTRACT_ABI, TICKET_CONTRACT_ADDRESS } from '../lib/contract';

export function useTicketContract() {
    const { data: getUserTickets } = useReadContract({
        address: TICKET_CONTRACT_ADDRESS,
        abi: TICKET_CONTRACT_ABI,
        functionName: 'getUserTickets',
    });

    const { data: getTicketDetails } = useReadContract({
        address: TICKET_CONTRACT_ADDRESS,
        abi: TICKET_CONTRACT_ABI,
        functionName: 'getTicketDetails',
    });

    const { writeContractAsync } = useWriteContract();

    return {
        getUserTickets,
        getTicketDetails,
        mintTicket: (args: any[]) => writeContractAsync({
            address: TICKET_CONTRACT_ADDRESS,
            abi: TICKET_CONTRACT_ABI,
            functionName: 'mintTicket',
            args,
        }),
        buyTicket: (args: any[]) => writeContractAsync({
            address: TICKET_CONTRACT_ADDRESS,
            abi: TICKET_CONTRACT_ABI,
            functionName: 'buyTicket',
            args,
        }),
        listTicketForSale: (args: any[]) => writeContractAsync({
            address: TICKET_CONTRACT_ADDRESS,
            abi: TICKET_CONTRACT_ABI,
            functionName: 'listTicketForSale',
            args,
        }),
        claimRefund: (args: any[]) => writeContractAsync({
            address: TICKET_CONTRACT_ADDRESS,
            abi: TICKET_CONTRACT_ABI,
            functionName: 'claimRefund',
            args,
        }),
    };
} 