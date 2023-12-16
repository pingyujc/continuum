require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and replace "KEY" with it
// const INFURA_API_KEY = "686bbffd824a4a6dad5dcd02806579c0";

// the orignial wallet used to deployed mvp
// const GOERLI_PRIVATE_KEY = "f32fc3dd874ef3e46baa7a1e2b2b15940f5aa49fc321f695e4ca9b2f871a13d3";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

module.exports = {
    solidity: "0.8.20",
    networks: {
        goerli: {
            // url: "https://eth-goerli.g.alchemy.com/v2/73T-F7ddT_z2hmjtyYelrNF8yrZ0F6cR",
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            // accounts: [
            //     "9e72e825aad968c35f03ca638029a44e1fd5900505af824fc1b22b65feed44f7",
            // ],
            // chainId: 5,
        },
    },
};
