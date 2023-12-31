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
    console.log("now testing some functions...");

    // console.log(network.config);

    const ttcToken = await continuumVault.getTokens();
    console.log("TTC consists: ");
    console.log(ttcToken);
    const ttcAddress = await continuumVault.getTtcTokenAddress();
    console.log(`TTC address is: ${ttcAddress}`);

    // const vaultData = await continuumVault.getVaultData();
    // console.log(vaultData);

    // continuumVault.updateTopTenTokens()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
