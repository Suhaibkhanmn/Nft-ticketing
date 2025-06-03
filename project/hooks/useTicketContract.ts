import { useContract, useContractRead, useContractWrite } from 'wagmi';
import { TICKET_CONTRACT_ABI, TICKET_CONTRACT_ADDRESS } from '../lib/contract';

export function useTicketContract() {
    const contract = useContract({
        address: TICKET_CONTRACT_ADDRESS,
        abi: TICKET_CONTRACT_ABI,
    });

    const { data: getUserTickets } = useContractRead({
        ...contract,
        functionName: 'getUserTickets',
    });

    const { writeAsync: mintTicket } = useContractWrite({
        ...contract,
        functionName: 'mintTicket',
    });

    const { writeAsync: buyTicket } = useContractWrite({
        ...contract,
        functionName: 'buyTicket',
    });

    const { writeAsync: listTicketForSale } = useContractWrite({
        ...contract,
        functionName: 'listTicketForSale',
    });

    const { writeAsync: claimRefund } = useContractWrite({
        ...contract,
        functionName: 'claimRefund',
    });

    const { data: getTicketDetails } = useContractRead({
        ...contract,
        functionName: 'getTicketDetails',
    });

    return {
        getUserTickets,
        mintTicket,
        buyTicket,
        listTicketForSale,
        claimRefund,
        getTicketDetails,
    };
} 