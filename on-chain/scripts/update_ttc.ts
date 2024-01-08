import { ethers } from "hardhat";

async function main() {
    // get first account from the list of accounts defined in hardhat.config.ts
    const [acc1] = await ethers.getSigners();

    // get the contract instance
    const contract = await ethers.getContractAt(
        "ContinuumVault", // name of the contract
        "0x07108AC974D719965DF27B321caA33743994F7cb" // deployed contract address
    );

    // call a simple view function `name` on the contract (no tx required)
    const ttc = await contract.getTokens();
    console.log("getToken:", ttc);

    const ttcAddress = await contract.getTtcTokenAddress();
    console.log("ttc Address:", ttcAddress);

    // send a tx from acc1, calling the `mint` function on the contract
    // with the to address = acc1.address and amount to be minted = 1
    const weights = [10, 20, 30];
    const addresses = [
        "0xbA63D4Bb4F5809d77BCc5Af043231b19D4999972",
        "0xbA63D4Bb4F5809d77BCc5Af043231b19D4999972",
        "0xbA63D4Bb4F5809d77BCc5Af043231b19D4999972",
    ];
    const tx = await contract
        .connect(acc1)
        .updateTopTenTokens(weights, addresses);

    // wait for the tx to be processed, then log the receipt
    const receipt = await tx.wait();
    console.log("Tx receipt:", receipt);

    // check the ttc token again after updating
    const new_ttc = await contract.getTokens();
    console.log("getToken:", new_ttc);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
