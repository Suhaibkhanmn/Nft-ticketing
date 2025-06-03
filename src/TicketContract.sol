// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "./EventContract.sol";

contract TicketContract is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;

    EventContract public eventContract;

    struct Ticket {
        uint256 id;
        uint256 eventId;
        uint256 price;
        bool isForSale;
        bool isRefunded;
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => uint256[]) public eventTickets;

    event TicketMinted(uint256 indexed ticketId, uint256 indexed eventId, address indexed owner);
    event TicketListed(uint256 indexed ticketId, uint256 price);
    event TicketSold(uint256 indexed ticketId, address indexed seller, address indexed buyer, uint256 price);
    event TicketTransferred(uint256 indexed ticketId, address indexed from, address indexed to);
    event TicketRefunded(uint256 indexed ticketId, address indexed owner);

    constructor(address _eventContractAddress) ERC721("EventTicket", "ETKT") Ownable(msg.sender) {
        eventContract = EventContract(_eventContractAddress);
    }

    function mintTicket(uint256 eventId) external payable nonReentrant returns (uint256) {
        EventContract.Event memory event_ = eventContract.getEventDetails(eventId);
        require(event_.isActive, "Event is not active");
        require(block.timestamp < event_.date, "Event expired");
        require(event_.ticketsSold < event_.maxTickets, "Sold out");
        require(msg.value >= event_.price, "Insufficient payment");

        uint256 newTicketId = ++_tokenIds;
        _safeMint(msg.sender, newTicketId);

        tickets[newTicketId] = Ticket({
            id: newTicketId,
            eventId: eventId,
            price: event_.price,
            isForSale: false,
            isRefunded: false
        });

        eventContract.incrementTicketsSold(eventId);
        userTickets[msg.sender].push(newTicketId);
        eventTickets[eventId].push(newTicketId);

        emit TicketMinted(newTicketId, eventId, msg.sender);

        // Pay event creator
        (bool sent,) = event_.creator.call{value: event_.price}("");
        require(sent, "Payout to organizer failed");

        // Refund extra if overpaid
        if (msg.value > event_.price) {
            (bool refunded,) = msg.sender.call{value: msg.value - event_.price}("");
            require(refunded, "Refund failed");
        }

        return newTicketId;
    }

    function bulkMintTickets(uint256 eventId, uint256 quantity) external payable nonReentrant returns (uint256[] memory) {
        require(quantity > 0, "Must mint at least one");

        EventContract.Event memory event_ = eventContract.getEventDetails(eventId);
        require(event_.isActive, "Event not active");
        require(block.timestamp < event_.date, "Event expired");
        require(event_.ticketsSold + quantity <= event_.maxTickets, "Not enough tickets");

        uint256 totalCost = event_.price * quantity;
        require(msg.value >= totalCost, "Insufficient payment");

        uint256[] memory mintedIds = new uint256[](quantity);

        for (uint256 i = 0; i < quantity; i++) {
            uint256 newTicketId = ++_tokenIds;
            _safeMint(msg.sender, newTicketId);

            tickets[newTicketId] = Ticket({
                id: newTicketId,
                eventId: eventId,
                price: event_.price,
                isForSale: false,
                isRefunded: false
            });

            eventContract.incrementTicketsSold(eventId);
            userTickets[msg.sender].push(newTicketId);
            eventTickets[eventId].push(newTicketId);

            mintedIds[i] = newTicketId;
            emit TicketMinted(newTicketId, eventId, msg.sender);
        }

        // Pay event creator
        (bool sent,) = event_.creator.call{value: totalCost}("");
        require(sent, "Payout to organizer failed");

        if (msg.value > totalCost) {
            (bool refunded,) = msg.sender.call{value: msg.value - totalCost}("");
            require(refunded, "Refund failed");
        }

        return mintedIds;
    }

    function claimRefund(uint256 ticketId) external nonReentrant {
        require(ownerOf(ticketId) == msg.sender, "Not ticket owner");
        Ticket storage ticket = tickets[ticketId];
        require(!ticket.isRefunded, "Already refunded");

        EventContract.Event memory event_ = eventContract.getEventDetails(ticket.eventId);
        require(!event_.isActive, "Event is not cancelled");

        ticket.isRefunded = true;
        _burn(ticketId);

        // Remove ticketId from userTickets[msg.sender]
        uint256[] storage ticketsOfUser = userTickets[msg.sender];
        for (uint256 i = 0; i < ticketsOfUser.length; i++) {
            if (ticketsOfUser[i] == ticketId) {
                ticketsOfUser[i] = ticketsOfUser[ticketsOfUser.length - 1];
                ticketsOfUser.pop();
                break;
            }
        }

        emit TicketRefunded(ticketId, msg.sender);

        (bool sent,) = msg.sender.call{value: ticket.price}("");
        require(sent, "Refund transfer failed");
    }

    function listTicketForSale(uint256 ticketId, uint256 newPrice) external {
        require(newPrice > 0, "Price must be > 0");
        require(ownerOf(ticketId) == msg.sender, "Not ticket owner");

        tickets[ticketId].price = newPrice;
        tickets[ticketId].isForSale = true;
        emit TicketListed(ticketId, newPrice);
    }

    function buyTicket(uint256 ticketId) public payable nonReentrant {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.isForSale, "Not for sale");
        require(msg.value >= ticket.price, "Insufficient payment");

        address seller = ownerOf(ticketId);
        ticket.isForSale = false;
        _transfer(seller, msg.sender, ticketId);

        (bool sent,) = seller.call{value: ticket.price}("");
        require(sent, "Payout failed");
        emit TicketSold(ticketId, seller, msg.sender, ticket.price);
    }

    function transferTicket(uint256 ticketId, address to) public {
        require(ownerOf(ticketId) == msg.sender, "Not ticket owner");
        require(to != address(0), "Invalid recipient");

        tickets[ticketId].isForSale = false;

        // Remove from sender
        uint256[] storage sellerTickets = userTickets[msg.sender];
        for (uint256 i = 0; i < sellerTickets.length; i++) {
            if (sellerTickets[i] == ticketId) {
                sellerTickets[i] = sellerTickets[sellerTickets.length - 1];
                sellerTickets.pop();
                break;
            }
        }
        // Add to receiver
        userTickets[to].push(ticketId);

        _transfer(msg.sender, to, ticketId);
        emit TicketTransferred(ticketId, msg.sender, to);
    }

    function getTicketDetails(uint256 ticketId) public view returns (Ticket memory) {
        require(_ownerOf(ticketId) != address(0), "Ticket does not exist");
        return tickets[ticketId];
    }

    function getUserTickets(address user) public view returns (uint256[] memory) {
        return userTickets[user];
    }

    function getEventTickets(uint256 eventId) public view returns (uint256[] memory) {
        return eventTickets[eventId];
    }
}
