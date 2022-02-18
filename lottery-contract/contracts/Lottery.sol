// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract Lottery {
    address public manager;
    address payable[] public players;
    uint256 private index;
    address public winner;

    constructor() {
        manager = msg.sender;
    }

    modifier Owner() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value >= .01 ether);
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public Owner {
        index = random() % players.length;
        players[index].transfer(address(this).balance);
        winner = players[index];
        players = new address payable[](0);
    }

    function showPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
