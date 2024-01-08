import { ethers, network } from "hardhat";

async function main() {
    const continuumVault = await ethers.deployContract(
        "ContinuumVault",
        [],
        {}
    );

    console.log("Deploying ContinuumVault...");

    await continuumVault.waitForDeployment();

    console.log(`ContinuumVault deployed to ${continuumVault.target}`);

    const ttcAddress = await continuumVault.getTtcTokenAddress();
    console.log(`TTC address is: ${ttcAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
