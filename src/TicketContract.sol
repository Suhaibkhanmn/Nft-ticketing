// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./EventContract.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TicketContract is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    EventContract public eventContract;
    
    struct Ticket {
        uint256 id;
        uint256 eventId;
        uint256 price;
        bool isForSale;
        address owner;
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => uint256[]) public eventTickets;

    event TicketMinted(uint256 indexed ticketId, uint256 indexed eventId, address indexed owner);
    event TicketListed(uint256 indexed ticketId, uint256 price);
    event TicketSold(uint256 indexed ticketId, address indexed seller, address indexed buyer, uint256 price);
    event TicketTransferred(uint256 indexed ticketId, address indexed from, address indexed to);

    constructor(address _eventContractAddress) ERC721("EventTicket", "ETKT") {
        eventContract = EventContract(_eventContractAddress);
    }

    function mintTicket(uint256 eventId) external payable nonReentrant {
        EventContract.Event memory event_ = eventContract.getEventDetails(eventId);
        require(event_.isActive, "Event is not active");
        require(block.timestamp < event_.date, "Event has expired");
        require(msg.value >= event_.price, "Insufficient payment");
        require(event_.ticketsSold < event_.maxTickets, "Event is sold out");

        _tokenIds.increment();
        uint256 newTicketId = _tokenIds.current();

        _safeMint(msg.sender, newTicketId);
        
        tickets[newTicketId] = Ticket({
            id: newTicketId,
            eventId: eventId,
            price: event_.price,
            isForSale: false,
            owner: msg.sender
        });

        userTickets[msg.sender].push(newTicketId);
        eventTickets[eventId].push(newTicketId);

        emit TicketMinted(newTicketId, eventId, msg.sender);
        return newTicketId;
    }

    function listTicketForSale(uint256 ticketId, uint256 newPrice) external {
        require(newPrice > 0, "Price must be greater than 0");
        require(_isApprovedOrOwner(msg.sender, ticketId), "Not ticket owner");

        tickets[ticketId].price = newPrice;
        tickets[ticketId].isForSale = true;

        emit TicketListed(ticketId, newPrice);
    }

    function buyTicket(uint256 ticketId) public payable {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.isForSale, "Ticket is not for sale");
        require(msg.value >= ticket.price, "Insufficient payment");

        address seller = ticket.owner;
        ticket.isForSale = false;
        ticket.owner = msg.sender;

        _transfer(seller, msg.sender, ticketId);

        emit TicketSold(ticketId, seller, msg.sender, ticket.price);
    }

    function transferTicket(uint256 ticketId, address to) public {
        require(_isApprovedOrOwner(msg.sender, ticketId), "Not ticket owner");
        require(to != address(0), "Invalid recipient");

        tickets[ticketId].owner = to;
        tickets[ticketId].isForSale = false;

        _transfer(msg.sender, to, ticketId);

        emit TicketTransferred(ticketId, msg.sender, to);
    }

    function getTicketDetails(uint256 ticketId) public view returns (Ticket memory) {
        require(_exists(ticketId), "Ticket does not exist");
        return tickets[ticketId];
    }

    function getUserTickets(address user) public view returns (uint256[] memory) {
        return userTickets[user];
    }

    function getEventTickets(uint256 eventId) public view returns (uint256[] memory) {
        return eventTickets[eventId];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 /* batchSize */
    ) internal virtual override {
        if (from != address(0) && to != address(0)) {
            // Remove ticket from seller's list
            uint256[] storage sellerTickets = userTickets[from];
            for (uint256 i = 0; i < sellerTickets.length; i++) {
                if (sellerTickets[i] == tokenId) {
                    sellerTickets[i] = sellerTickets[sellerTickets.length - 1];
                    sellerTickets.pop();
                    break;
                }
            }
            
            // Add ticket to buyer's list
            userTickets[to].push(tokenId);
        }
    }
} 