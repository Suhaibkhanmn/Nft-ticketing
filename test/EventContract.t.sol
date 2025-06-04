// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/EventContract.sol";

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

    function test_CreateAndCancelEvent() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("Event", "Desc", block.timestamp + 1 days, "Loc", 1 ether, 100, "");

        EventContract.Event memory e = eventContract.getEventDetails(eventId);
        assertTrue(e.isActive);

        eventContract.cancelEvent(eventId);
        e = eventContract.getEventDetails(eventId);
        assertFalse(e.isActive);

        vm.stopPrank();
    }

    function test_RevertWhen_UpdateByNonCreator() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("E", "D", block.timestamp + 1 days, "L", 1 ether, 50, "");
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert();
        eventContract.updateEventDetails(eventId, "E2", "D2", block.timestamp + 2 days, "L2", 2 ether, 100);
        vm.stopPrank();
    }

    function test_RevertWhen_CancelByNonCreator() public {
        vm.startPrank(creator);
        uint256 eventId = eventContract.createEvent("E", "D", block.timestamp + 1 days, "L", 1 ether, 50, "");
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert();
        eventContract.cancelEvent(eventId);
        vm.stopPrank();
    }
}
