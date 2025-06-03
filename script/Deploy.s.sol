// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EventContract.sol";
import "../src/TicketContract.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy EventContract
        EventContract eventContract = new EventContract();

        // Deploy TicketContract with the address of EventContract
        new TicketContract(address(eventContract));

        vm.stopBroadcast();
    }
}
