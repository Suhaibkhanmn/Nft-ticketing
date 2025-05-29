// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {EventContract} from "../src/EventContract.sol";

contract EventContractTest is Test {
    EventContract public eventContract;
    address public creator;
    address public user;

    function setUp() public {
        creator = makeAddr("creator");
        user = makeAddr("user");
        vm.startPrank(creator);
        eventContract = new EventContract();
        vm.stopPrank();
    }

    function test_CreateEvent() public {
        vm.startPrank(creator);
        
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );

        EventContract.Event memory event_ = eventContract.getEventDetails(eventId);
        
        assertEq(event_.name, "Test Event");
        assertEq(event_.description, "Test Description");
        assertEq(event_.location, "Test Location");
        assertEq(event_.price, 0.1 ether);
        assertEq(event_.maxTickets, 100);
        assertEq(event_.ticketsSold, 0);
        assertTrue(event_.isActive);
        assertEq(event_.creator, creator);

        vm.stopPrank();
    }

    function test_UpdateEvent() public {
        vm.startPrank(creator);
        
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );

        eventContract.updateEventDetails(
            eventId,
            "Updated Event",
            "Updated Description",
            block.timestamp + 2 days,
            "Updated Location",
            0.2 ether,
            200
        );

        EventContract.Event memory event_ = eventContract.getEventDetails(eventId);
        
        assertEq(event_.name, "Updated Event");
        assertEq(event_.description, "Updated Description");
        assertEq(event_.location, "Updated Location");
        assertEq(event_.price, 0.2 ether);
        assertEq(event_.maxTickets, 200);

        vm.stopPrank();
    }

    function test_CancelEvent() public {
        vm.startPrank(creator);
        
        uint256 eventId = eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            100
        );

        eventContract.cancelEvent(eventId);

        EventContract.Event memory event_ = eventContract.getEventDetails(eventId);
        assertFalse(event_.isActive);

        vm.stopPrank();
    }

    function test_GetCreatorEvents() public {
        vm.startPrank(creator);
        
        uint256 eventId1 = eventContract.createEvent(
            "Test Event 1",
            "Test Description 1",
            block.timestamp + 1 days,
            "Test Location 1",
            0.1 ether,
            100
        );

        uint256 eventId2 = eventContract.createEvent(
            "Test Event 2",
            "Test Description 2",
            block.timestamp + 2 days,
            "Test Location 2",
            0.2 ether,
            200
        );

        uint256[] memory creatorEvents = eventContract.getCreatorEvents(creator);
        
        assertEq(creatorEvents.length, 2);
        assertEq(creatorEvents[0], eventId1);
        assertEq(creatorEvents[1], eventId2);

        vm.stopPrank();
    }

    function testFail_NonCreatorUpdateEvent() public {
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

        vm.startPrank(user);
        vm.expectRevert("Only creator can update event");
        eventContract.updateEventDetails(
            eventId,
            "Updated Event",
            "Updated Description",
            block.timestamp + 2 days,
            "Updated Location",
            0.2 ether,
            200
        );
        vm.stopPrank();
    }

    function testFail_NonCreatorCancelEvent() public {
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

        vm.startPrank(user);
        vm.expectRevert("Only creator can cancel event");
        eventContract.cancelEvent(eventId);
        vm.stopPrank();
    }

    function testFail_CreateEventWithPastDate() public {
        vm.startPrank(creator);
        vm.expectRevert("Event date must be in the future");
        eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp - 1 days,
            "Test Location",
            0.1 ether,
            100
        );
        vm.stopPrank();
    }

    function testFail_CreateEventWithZeroTickets() public {
        vm.startPrank(creator);
        vm.expectRevert("Max tickets must be greater than 0");
        eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0.1 ether,
            0
        );
        vm.stopPrank();
    }

    function testFail_CreateEventWithZeroPrice() public {
        vm.startPrank(creator);
        vm.expectRevert("Price must be greater than 0");
        eventContract.createEvent(
            "Test Event",
            "Test Description",
            block.timestamp + 1 days,
            "Test Location",
            0,
            100
        );
        vm.stopPrank();
    }
} 