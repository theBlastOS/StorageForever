import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("storage:get", "Get stored value from SimpleStorage contract")
  .addParam("contract", "SimpleStorage contract address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const { contract } = taskArguments;
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = SimpleStorage.attach(contract);

    const storedValue = await simpleStorage.retrieve();
    console.log(`Stored value: ${storedValue}`);

    return storedValue;
  });

task("storage:set", "Set a value in SimpleStorage contract")
  .addParam("contract", "SimpleStorage contract address")
  .addParam("value", "Value to store")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const { contract, value } = taskArguments;
    const [signer] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = SimpleStorage.attach(contract);

    const tx = await simpleStorage.connect(signer).store(value);
    await tx.wait();

    console.log(`Value ${value} stored in contract ${contract}`);
    console.log(`Transaction hash: ${tx.hash}`);
  });

task("storage:increment", "Increment the stored value in SimpleStorage contract")
  .addParam("contract", "SimpleStorage contract address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const { contract } = taskArguments;
    const [signer] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = SimpleStorage.attach(contract);

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value: ${currentValue}`);

    const tx = await simpleStorage.connect(signer).increment();
    await tx.wait();

    const newValue = await simpleStorage.retrieve();
    console.log(`New value after increment: ${newValue}`);
    console.log(`Transaction hash: ${tx.hash}`);
  });