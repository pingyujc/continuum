import { ethers } from "hardhat";
import {
    getCoinMarketCapAPIKey,
    getTop10,
    fetchTopTokens,
} from "./fetchTopTokens";

async function main() {
    // get first account from the list of accounts defined in hardhat.config.ts
    const [acc1] = await ethers.getSigners();

    const CONTRACT_NAME = "ContinuumVault";
    const CONTRACT_ADDRESS = "0x07108AC974D719965DF27B321caA33743994F7cb";

    const contract = await ethers.getContractAt(
        CONTRACT_NAME,
        CONTRACT_ADDRESS
    );

    // try getting the token address
    const ttcAddress = await contract.getTtcTokenAddress();
    console.log("ttc Token Address:", ttcAddress);

    // what current ttc consists
    const ttc = await contract.getTokens();
    console.log("getToken:", ttc);

    // get the api
    const cmc_api = getCoinMarketCapAPIKey();
    // console.log("coin marketcap API:", cmc_api);
    // get the top 10 token and weight
    const tokenList = await fetchTopTokens(cmc_api);
    // console.log(tokenList);
    const topTenArray = await getTop10(tokenList, cmc_api);
    console.log("top 10 tokens:", topTenArray);

    // send a tx from acc1, calling the `mint` function on the contract
    // with the to address = acc1.address and amount to be minted = 1
    let weights = [];
    let addresses = [];
    let total_weight = 0;
    // setting the weight
    // round to integer, and min is 1
    for (const token of topTenArray) {
        const modifiedWeight = Math.max(1, Math.round(token.weight));
        total_weight += modifiedWeight;

        // Directly push the modified weight into the weights array
        weights.push(modifiedWeight);
        // weights.push(token.weight);
        addresses.push(token.address);
    }
    // if it went above 100, we take off extra from btc
    if (total_weight - 100 > 0) {
        weights[0] -= total_weight - 100;
    }

    // the new weights and addresses in TTC
    console.log("THE NEW WEIGHTS AND TOKEN ADDRESS IN TTC:");
    console.log(weights);
    console.log(addresses);

    // weights = [1, 2, 3];
    // addresses = [
    //     "0xbA63D4Bb4F5809d77BCc5Af043231b19D4999972",
    //     "0xbA63D4Bb4F5809d77BCc5Af043231b19D4999972",
    //     "0xbA63D4Bb4F5809d77BCc5Af043231b19D4999972",
    // ];

    // const tx = await contract
    //     .connect(acc1)
    //     .updateTopTenTokens(weights, addresses);

    // // wait for the tx to be processed, then log the receipt
    // const receipt = await tx.wait();
    // console.log("Tx receipt:", receipt);

    // // check the ttc token again after updating
    // const new_ttc = await contract.getTokens();
    // console.log("getToken:", new_ttc);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
