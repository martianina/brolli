import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployBrolli: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Brolli", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployBrolli;

deployBrolli.tags = ["Brolli"]; 