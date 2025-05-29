// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {EventContract} from "../src/EventContract.sol";
import {TicketContract} from "../src/TicketContract.sol";

contract TicketContractTest is Test {
    EventContract public eventContract;
    TicketContract public ticketContract;
    address public creator;
    address public buyer;
    address public seller;

    function setUp() public {
        creator = makeAddr("creator");
        buyer = makeAddr("buyer");
        seller = makeAddr("seller");

        vm.startPrank(creator);
        eventContract = new EventContract();
        ticketContract = new TicketContract(address(eventContract));
        vm.stopPrank();
    }

    function test_MintTicket() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);

        TicketContract.Ticket memory ticket = ticketContract.getTicketDetails(ticketId);
        assertEq(ticket.id, ticketId);
        assertEq(ticket.eventId, eventId);
        assertEq(ticket.price, 0.1 ether);
        assertFalse(ticket.isForSale);
        assertEq(ticket.owner, buyer);

        uint256[] memory userTickets = ticketContract.getUserTickets(buyer);
        assertEq(userTickets.length, 1);
        assertEq(userTickets[0], ticketId);

        uint256[] memory eventTickets = ticketContract.getEventTickets(eventId);
        assertEq(eventTickets.length, 1);
        assertEq(eventTickets[0], ticketId);

        vm.stopPrank();
    }

    function test_ListTicketForSale() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);
        vm.stopPrank();

        vm.startPrank(buyer);
        ticketContract.listTicketForSale(ticketId, 0.2 ether);

        TicketContract.Ticket memory ticket = ticketContract.getTicketDetails(ticketId);
        assertTrue(ticket.isForSale);
        assertEq(ticket.price, 0.2 ether);
        vm.stopPrank();
    }

    function test_BuyTicket() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(seller);
        vm.deal(seller, 1 ether);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);
        ticketContract.listTicketForSale(ticketId, 0.2 ether);
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);
        ticketContract.buyTicket{value: 0.2 ether}(ticketId);

        TicketContract.Ticket memory ticket = ticketContract.getTicketDetails(ticketId);
        assertFalse(ticket.isForSale);
        assertEq(ticket.owner, buyer);

        uint256[] memory buyerTickets = ticketContract.getUserTickets(buyer);
        assertEq(buyerTickets.length, 1);
        assertEq(buyerTickets[0], ticketId);

        uint256[] memory sellerTickets = ticketContract.getUserTickets(seller);
        assertEq(sellerTickets.length, 0);

        vm.stopPrank();
    }

    function test_TransferTicket() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);
        vm.stopPrank();

        vm.startPrank(buyer);
        ticketContract.transferTicket(ticketId, seller);

        TicketContract.Ticket memory ticket = ticketContract.getTicketDetails(ticketId);
        assertEq(ticket.owner, seller);
        assertFalse(ticket.isForSale);

        uint256[] memory buyerTickets = ticketContract.getUserTickets(buyer);
        assertEq(buyerTickets.length, 0);

        uint256[] memory sellerTickets = ticketContract.getUserTickets(seller);
        assertEq(sellerTickets.length, 1);
        assertEq(sellerTickets[0], ticketId);

        vm.stopPrank();
    }

    function testFail_MintTicketWithInsufficientPayment() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 0.05 ether);
        vm.expectRevert("Insufficient payment");
        ticketContract.mintTicket{value: 0.05 ether}(eventId);
        vm.stopPrank();
    }

    function testFail_ListTicketForSaleNotOwner() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);
        vm.stopPrank();

        vm.startPrank(seller);
        vm.expectRevert("Not ticket owner");
        ticketContract.listTicketForSale(ticketId, 0.2 ether);
        vm.stopPrank();
    }

    function testFail_BuyTicketNotForSale() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);
        vm.stopPrank();

        vm.startPrank(seller);
        vm.deal(seller, 1 ether);
        vm.expectRevert("Ticket is not for sale");
        ticketContract.buyTicket{value: 0.2 ether}(ticketId);
        vm.stopPrank();
    }

    function testFail_TransferTicketNotOwner() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);
        vm.stopPrank();

        vm.startPrank(seller);
        vm.expectRevert("Not ticket owner");
        ticketContract.transferTicket(ticketId, creator);
        vm.stopPrank();
    }
} 