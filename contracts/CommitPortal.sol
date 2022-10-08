// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CommitPortal {
  // variables definition
  uint256 totalCommits;
  uint256 wager;
  uint256 secondsToWait = 30;

  // a NewCommit takes in:
  // address from
  // address to
  // timestamp
  // commitMessage
  // TODO: an IPFS picture
  event NewCommit(address indexed from, address indexed to, uint256 timestamp, string commitMessage);

// the "Commit" struct
struct Commit {
  address commiter;
  string message;
  uint256 timestamp;
  }
}

// the "commits" array that takes in Commit structs
Commit[] commits;

// when the address last commited at
mapping(address => uint256) public lastCommitedAt;  

// TODO: _also_ takes in "picture" and "wager"
function commit(string memory _message) public {

  // must wait 30 seconds before waving again
  require(
    lastWavedAt[msg.sender] + secondsToWait seconds < block.timestamp,
    "Must wait 30 seconds before comitting again."
  );

  // update lastCommitedAt mapping
  lastCommitedAt[msg.sender] = block.timestamp;
  
  totalCommits += 1;
  console.log("\n%s has commited with message: %s", msg.sender, _message);
  commits.push(Commit(msg.sender, _message, block.timestamp));

  // a Getter for the Commit array
  function getAllCommits() public view returns (Commit[] memory) {
    return commits;
  }

  // a Getter for the totalCommits integer
  function getTotalCommits() public view returns (uint256) {
    return totalCommits;
  }
}
