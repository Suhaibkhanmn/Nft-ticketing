// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventContract is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _eventIds;

    struct Event {
        uint256 id;
        string name;
        string description;
        uint256 date;
        string location;
        uint256 price;
        uint256 maxTickets;
        uint256 ticketsSold;
        bool isActive;
        address creator;
    }

    mapping(uint256 => Event) public events;
    mapping(address => uint256[]) public creatorEvents;

    event EventCreated(uint256 indexed eventId, address indexed creator);
    event EventUpdated(uint256 indexed eventId);
    event EventCancelled(uint256 indexed eventId);

    function createEvent(
        string memory name,
        string memory description,
        uint256 date,
        string memory location,
        uint256 price,
        uint256 maxTickets
    ) public returns (uint256) {
        require(date > block.timestamp, "Event date must be in the future");
        require(maxTickets > 0, "Max tickets must be greater than 0");
        require(price > 0, "Price must be greater than 0");

        _eventIds.increment();
        uint256 newEventId = _eventIds.current();

        events[newEventId] = Event({
            id: newEventId,
            name: name,
            description: description,
            date: date,
            location: location,
            price: price,
            maxTickets: maxTickets,
            ticketsSold: 0,
            isActive: true,
            creator: msg.sender
        });

        creatorEvents[msg.sender].push(newEventId);

        emit EventCreated(newEventId, msg.sender);
        return newEventId;
    }

    function getEventDetails(uint256 eventId) public view returns (Event memory) {
        require(events[eventId].id != 0, "Event does not exist");
        return events[eventId];
    }

    function updateEventDetails(
        uint256 eventId,
        string memory name,
        string memory description,
        uint256 date,
        string memory location,
        uint256 price,
        uint256 maxTickets
    ) external onlyCreator(eventId) {
        require(date > block.timestamp, "Event date must be in the future");
        require(maxTickets >= events[eventId].ticketsSold, "Max tickets cannot be less than tickets sold");
        require(price > 0, "Price must be greater than 0");

        Event storage event_ = events[eventId];
        event_.name = name;
        event_.description = description;
        event_.date = date;
        event_.location = location;
        event_.price = price;
        event_.maxTickets = maxTickets;

        emit EventUpdated(eventId);
    }

    function cancelEvent(uint256 eventId) public {
        require(events[eventId].creator == msg.sender, "Only creator can cancel event");
        require(events[eventId].isActive, "Event is already cancelled");

        events[eventId].isActive = false;
        emit EventCancelled(eventId);
    }

    function getCreatorEvents(address creator) public view returns (uint256[] memory) {
        return creatorEvents[creator];
    }
} 