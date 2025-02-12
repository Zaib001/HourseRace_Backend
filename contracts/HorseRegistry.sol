// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HorseRegistry { 
    struct Horse {
        address owner;
        string name;
        bool verified;
    }

    mapping(string => Horse) public horses;
    address public admin;

    event HorseRegistered(string name, address owner);
    event HorseApproved(string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can approve horses");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerHorse(address _owner, string memory _name) public {
        require(horses[_name].owner == address(0), "Horse already registered");
        horses[_name] = Horse(_owner, _name, false);
        emit HorseRegistered(_name, _owner);
    }

    function approveHorse(string memory _name) public onlyAdmin {
        require(horses[_name].owner != address(0), "Horse not found");
        horses[_name].verified = true;
        emit HorseApproved(_name);
    }

    function getHorseDetails(string memory _name) public view returns (address, bool) {
        Horse memory horse = horses[_name];
        return (horse.owner, horse.verified);
    }
}
