import { ethers } from "hardhat";

async function main() {
  const continuumVault = await ethers.deployContract("ContinuumVault", [], {});

  console.log("Deploying ContinuumVault...")

  await continuumVault.waitForDeployment();

  console.log(
    `ContinuumVault deployed to ${continuumVault.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
