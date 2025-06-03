import { ethers } from 'ethers';

// Contract ABIs
export const EVENT_CONTRACT_ABI = [
    "function createEvent(string memory name, string memory description, uint256 date, string memory location, uint256 price, uint256 maxTickets, string memory image) public returns (uint256)",
    "function getEventDetails(uint256 eventId) public view returns (tuple(uint256 id, string name, string description, uint256 date, string location, uint256 price, uint256 maxTickets, uint256 ticketsSold, bool isActive, address creator))",
    "function getAllEvents() public view returns (uint256[] memory)",
    "function purchaseTicket(uint256 eventId) public payable",
    "function getEventTickets(uint256 eventId) public view returns (uint256[] memory)",
    "function transferTicket(uint256 eventId, uint256 ticketId, address to) public",
    "function getCreatorEvents(address creator) public view returns (uint256[] memory)",
    "event EventCreated(uint256 indexed eventId, string name, address organizer)",
    "event TicketPurchased(uint256 indexed eventId, uint256 indexed ticketId, address buyer)",
    "event TicketTransferred(uint256 indexed eventId, uint256 indexed ticketId, address from, address to)"
];

export const TICKET_CONTRACT_ABI = [
    { "type": "constructor", "inputs": [{ "name": "_eventContractAddress", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" },
    { "type": "function", "name": "approve", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "balanceOf", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "bulkMintTickets", "inputs": [{ "name": "eventId", "type": "uint256", "internalType": "uint256" }, { "name": "quantity", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }], "stateMutability": "payable" },
    { "type": "function", "name": "buyTicket", "inputs": [{ "name": "ticketId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "payable" },
    { "type": "function", "name": "claimRefund", "inputs": [{ "name": "ticketId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "eventContract", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract EventContract" }], "stateMutability": "view" },
    { "type": "function", "name": "eventTickets", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }, { "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "getApproved", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    { "type": "function", "name": "getEventTickets", "inputs": [{ "name": "eventId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }], "stateMutability": "view" },
    { "type": "function", "name": "getTicketDetails", "inputs": [{ "name": "ticketId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct TicketContract.Ticket", "components": [{ "name": "id", "type": "uint256", "internalType": "uint256" }, { "name": "eventId", "type": "uint256", "internalType": "uint256" }, { "name": "price", "type": "uint256", "internalType": "uint256" }, { "name": "isForSale", "type": "bool", "internalType": "bool" }, { "name": "isRefunded", "type": "bool", "internalType": "bool" }] }], "stateMutability": "view" },
    { "type": "function", "name": "getUserTickets", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }], "stateMutability": "view" },
    { "type": "function", "name": "isApprovedForAll", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "operator", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
    { "type": "function", "name": "listTicketForSale", "inputs": [{ "name": "ticketId", "type": "uint256", "internalType": "uint256" }, { "name": "newPrice", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "mintTicket", "inputs": [{ "name": "eventId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "payable" },
    { "type": "function", "name": "name", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
    { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    { "type": "function", "name": "ownerOf", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "safeTransferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "safeTransferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }, { "name": "data", "type": "bytes", "internalType": "bytes" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "setApprovalForAll", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }, { "name": "approved", "type": "bool", "internalType": "bool" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "supportsInterface", "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
    { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
    { "type": "function", "name": "tickets", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "id", "type": "uint256", "internalType": "uint256" }, { "name": "eventId", "type": "uint256", "internalType": "uint256" }, { "name": "price", "type": "uint256", "internalType": "uint256" }, { "name": "isForSale", "type": "bool", "internalType": "bool" }, { "name": "isRefunded", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
    { "type": "function", "name": "tokenURI", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
    { "type": "function", "name": "transferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "transferTicket", "inputs": [{ "name": "ticketId", "type": "uint256", "internalType": "uint256" }, { "name": "to", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "userTickets", "inputs": [{ "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "event", "name": "Approval", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "approved", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }], "anonymous": false },
    { "type": "event", "name": "ApprovalForAll", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "operator", "type": "address", "indexed": true, "internalType": "address" }, { "name": "approved", "type": "bool", "indexed": false, "internalType": "bool" }], "anonymous": false },
    { "type": "event", "name": "BatchMetadataUpdate", "inputs": [{ "name": "_fromTokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "_toTokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
    { "type": "event", "name": "MetadataUpdate", "inputs": [{ "name": "_tokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
    { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
    { "type": "event", "name": "TicketListed", "inputs": [{ "name": "ticketId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "price", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
    { "type": "event", "name": "TicketMinted", "inputs": [{ "name": "ticketId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "eventId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "owner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
    { "type": "event", "name": "TicketRefunded", "inputs": [{ "name": "ticketId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "owner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
    { "type": "event", "name": "TicketSold", "inputs": [{ "name": "ticketId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "seller", "type": "address", "indexed": true, "internalType": "address" }, { "name": "buyer", "type": "address", "indexed": true, "internalType": "address" }, { "name": "price", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
    { "type": "event", "name": "TicketTransferred", "inputs": [{ "name": "ticketId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
    { "type": "event", "name": "Transfer", "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }], "anonymous": false },
    { "type": "error", "name": "ERC721IncorrectOwner", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }, { "name": "owner", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC721InsufficientApproval", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }] },
    { "type": "error", "name": "ERC721InvalidApprover", "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC721InvalidOperator", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC721InvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC721InvalidReceiver", "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC721InvalidSender", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC721NonexistentToken", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }] },
    { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
];

// Contract addresses - replace with your deployed contract addresses
export const EVENT_CONTRACT_ADDRESS = "0x37bF15Edae85351E779c55590A558EFe95650467";
export const TICKET_CONTRACT_ADDRESS = "0xfB620c721CC55a4f2BFe8E8272aCb6FFEA1b851D";

// Contract factory functions
export const getEventContract = (signer: ethers.Signer) => {
    return new ethers.Contract(EVENT_CONTRACT_ADDRESS, EVENT_CONTRACT_ABI, signer);
};

export const getTicketContract = (signer: ethers.Signer) => {
    return new ethers.Contract(TICKET_CONTRACT_ADDRESS, TICKET_CONTRACT_ABI, signer);
}; 