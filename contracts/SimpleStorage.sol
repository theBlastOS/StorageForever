// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

contract SimpleStorage {
    uint256 private storedData;
    address public owner;

    event DataStored(uint256 indexed newValue, address indexed setter);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint256 _initialValue) {
        storedData = _initialValue;
        owner = msg.sender;
        emit DataStored(_initialValue, msg.sender);
    }

    function store(uint256 _value) external {
        storedData = _value;
        emit DataStored(_value, msg.sender);
    }

    function retrieve() external view returns (uint256) {
        return storedData;
    }

    function increment() external {
        storedData += 1;
        emit DataStored(storedData, msg.sender);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        address previousOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(previousOwner, _newOwner);
    }
}