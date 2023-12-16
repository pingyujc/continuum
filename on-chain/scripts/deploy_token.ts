import { ethers } from "hardhat";

async function main() {
    // setting up the initial owner address
    const initialOwnerAddress = "0x2AAA3F617D1C10A9f85293e8dD8A866C09053E99";
    const TTC = await ethers.deployContract("TTC", [initialOwnerAddress], {});

    console.log("Deploying TTC...");

    await TTC.waitForDeployment();

    console.log(`TTC deployed to ${TTC.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
