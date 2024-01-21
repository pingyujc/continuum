import axios, { Agent } from "axios";
import https from "https";

async function claimTestEth(walletAddress: string): Promise<void> {
    const faucetUrl = "https://goerli-faucet.slock.it/";

    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.post(faucetUrl, walletAddress, {
            httpsAgent: agent,
        });
        // console.log(response.data);
        console.log("Test Ether claimed successfully!");
    } catch (error) {
        console.error("Error claiming test ether:", error.message);
    }
}

// Replace 'your_wallet_address' with your actual Goerli testnet wallet address
// 0x2AAA3F617D1C10A9f85293e8dD8A866C09053E99
// 0x26fe97917F8D79E368d78455FEc7855a55d09086
const yourWalletAddress = "0x2AAA3F617D1C10A9f85293e8dD8A866C09053E99";

claimTestEth(yourWalletAddress);
