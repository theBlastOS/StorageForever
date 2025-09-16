import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SimpleStorage } from "../types";

describe("SimpleStorage", function () {
  async function deploySimpleStorageFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const initialValue = 42;

    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy(initialValue);

    return { simpleStorage, owner, otherAccount, initialValue };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { simpleStorage, owner } = await loadFixture(deploySimpleStorageFixture);
      expect(await simpleStorage.owner()).to.equal(owner.address);
    });

    it("Should set the initial value", async function () {
      const { simpleStorage, initialValue } = await loadFixture(deploySimpleStorageFixture);
      expect(await simpleStorage.retrieve()).to.equal(initialValue);
    });

    it("Should emit DataStored event on deployment", async function () {
      const [owner] = await ethers.getSigners();
      const initialValue = 100;
      const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
      const contract = await SimpleStorage.deploy(initialValue);

      await expect(contract.deploymentTransaction())
        .to.emit(contract, "DataStored")
        .withArgs(initialValue, owner.address);
    });
  });

  describe("Storage Operations", function () {
    it("Should store and retrieve a value", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
      const newValue = 123;

      await simpleStorage.store(newValue);
      expect(await simpleStorage.retrieve()).to.equal(newValue);
    });

    it("Should emit DataStored event when storing", async function () {
      const { simpleStorage, owner } = await loadFixture(deploySimpleStorageFixture);
      const newValue = 456;

      await expect(simpleStorage.store(newValue))
        .to.emit(simpleStorage, "DataStored")
        .withArgs(newValue, owner.address);
    });

    it("Should increment the stored value", async function () {
      const { simpleStorage, initialValue } = await loadFixture(deploySimpleStorageFixture);

      await simpleStorage.increment();
      expect(await simpleStorage.retrieve()).to.equal(initialValue + 1);
    });

    it("Should emit DataStored event when incrementing", async function () {
      const { simpleStorage, owner, initialValue } = await loadFixture(deploySimpleStorageFixture);

      await expect(simpleStorage.increment())
        .to.emit(simpleStorage, "DataStored")
        .withArgs(initialValue + 1, owner.address);
    });

    it("Should allow anyone to store values", async function () {
      const { simpleStorage, otherAccount } = await loadFixture(deploySimpleStorageFixture);
      const newValue = 789;

      await simpleStorage.connect(otherAccount).store(newValue);
      expect(await simpleStorage.retrieve()).to.equal(newValue);
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      const { simpleStorage, owner, otherAccount } = await loadFixture(deploySimpleStorageFixture);

      await simpleStorage.transferOwnership(otherAccount.address);
      expect(await simpleStorage.owner()).to.equal(otherAccount.address);
    });

    it("Should emit OwnershipTransferred event", async function () {
      const { simpleStorage, owner, otherAccount } = await loadFixture(deploySimpleStorageFixture);

      await expect(simpleStorage.transferOwnership(otherAccount.address))
        .to.emit(simpleStorage, "OwnershipTransferred")
        .withArgs(owner.address, otherAccount.address);
    });

    it("Should revert when non-owner tries to transfer ownership", async function () {
      const { simpleStorage, otherAccount } = await loadFixture(deploySimpleStorageFixture);

      await expect(
        simpleStorage.connect(otherAccount).transferOwnership(otherAccount.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should revert when transferring to zero address", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

      await expect(
        simpleStorage.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("New owner cannot be zero address");
    });
  });
});