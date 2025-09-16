import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const initialValue = 42; // Initial storage value

  const deployedSimpleStorage = await deploy("SimpleStorage", {
    from: deployer,
    args: [initialValue],
    log: true,
  });

  console.log(`SimpleStorage contract deployed to: ${deployedSimpleStorage.address}`);
  console.log(`Initial value set to: ${initialValue}`);
};

export default func;
func.id = "deploy_simplestorage";
func.tags = ["SimpleStorage"];