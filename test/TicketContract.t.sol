// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/EventContract.sol";
import "../src/TicketContract.sol";

contract TicketContractTest is Test {
    EventContract public eventContract;
    TicketContract public ticketContract;

    address public creator;
    address public buyer;

    function setUp() public {
        creator = makeAddr("creator");
        buyer = makeAddr("buyer");

        vm.startPrank(creator);
        eventContract = new EventContract();
        ticketContract = new TicketContract(address(eventContract));
        vm.stopPrank();
    }

    function test_MintSingleTicket() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("Test", "Desc", block.timestamp + 1 days, "Loc", 0.1 ether, 10, "");
        vm.stopPrank();

        vm.deal(buyer, 1 ether);
        vm.startPrank(buyer);
        uint256 ticketId = ticketContract.mintTicket{value: 0.1 ether}(eventId);

        TicketContract.Ticket memory t = ticketContract.getTicketDetails(ticketId);
        assertEq(t.price, 0.1 ether);
        assertEq(ticketContract.ownerOf(ticketId), buyer);
        assertFalse(t.isRefunded);
        vm.stopPrank();
    }

    function test_BulkMintTickets() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("Bulk", "Desc", block.timestamp + 1 days, "Loc", 0.2 ether, 100, "");
        vm.stopPrank();

        vm.deal(buyer, 5 ether);
        vm.startPrank(buyer);
        uint256[] memory ids = ticketContract.bulkMintTickets{value: 1 ether}(eventId, 5);
        assertEq(ids.length, 5);
        assertEq(ticketContract.getUserTickets(buyer).length, 5);
        vm.stopPrank();
    }

    function test_RefundAfterCancellation() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("Refundable", "Desc", block.timestamp + 1 days, "Loc", 0.3 ether, 10, "");
        vm.stopPrank();

        vm.deal(buyer, 1 ether);
        vm.startPrank(buyer);
        uint256 ticketId = ticketContract.mintTicket{value: 0.3 ether}(eventId);
        vm.stopPrank();

        vm.prank(creator);
        eventContract.cancelEvent(eventId);

        vm.deal(address(ticketContract), 1 ether);

        vm.startPrank(buyer);
        ticketContract.claimRefund(ticketId);
        assertEq(ticketContract.getUserTickets(buyer).length, 0);
        vm.stopPrank();
    }

    function testFail_RefundBeforeCancel() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("FailRefund", "Desc", block.timestamp + 1 days, "Loc", 0.3 ether, 10, "");
        vm.stopPrank();

        vm.deal(buyer, 1 ether);
        vm.startPrank(buyer);
        uint256 ticketId = ticketContract.mintTicket{value: 0.3 ether}(eventId);
        ticketContract.claimRefund(ticketId); // should fail
        vm.stopPrank();
    }

    function testFail_OverMintBeyondMax() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("SmallCap", "Desc", block.timestamp + 1 days, "Loc", 0.1 ether, 2, "");
        vm.stopPrank();

        vm.deal(buyer, 1 ether);
        vm.startPrank(buyer);
        ticketContract.bulkMintTickets{value: 0.3 ether}(eventId, 3); // exceeds max
        vm.stopPrank();
    }
}
