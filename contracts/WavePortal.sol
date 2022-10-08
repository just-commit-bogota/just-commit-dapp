// SPDX-License-Identifier: UNLICENSED
// https://github.com/danielbelfort/waveportal-starter-project/tree/main/src

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;
    
    event NewWave(address indexed from, uint256 timestamp, string message);
   
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }
    
    Wave[] waves;

    mapping(address => uint256) public lastWavedAt;    

    constructor() payable {
        console.log("We have been constructed!\n");
        seed = (block.timestamp + block.difficulty) % 100; // initial (useless) seed
    }

    function wave(string memory _message) public {

        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Must wait 30 seconds before waving again."
        );
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("\n%s has waved with message: %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Seed: %d", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.00001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}