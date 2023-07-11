const { ethers, network } = require("hardhat");
const {
  developmentChains,
  blockWaitConfirmations,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const waitConfirmations = developmentChains.includes(network.name)
    ? 1
    : blockWaitConfirmations;

  const arguments = [];

  const walaoEdSheeran = await deploy("WalaoEdSheeran", {
    from: deployer,
    log: true,
    args: arguments,
    waitConfirmations: waitConfirmations,
  });

  const presaleWalao1Args = [walaoEdSheeran.address];

  const presaleWalao1 = await deploy("PresaleWalao1", {
    from: deployer,
    log: true,
    args: presaleWalao1Args,
    waitConfirmations: waitConfirmations,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(walaoEdSheeran.address, []);
    await verify(
      presaleWalao1.address,
      presaleWalao1Args,
      "contracts/PresaleWalao1.sol:PresaleWalao1"
    );
  }
};

module.exports.tags = ["all", "walao-ed-sheeran"];
