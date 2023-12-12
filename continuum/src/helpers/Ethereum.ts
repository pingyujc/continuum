import { Signer, ethers } from "ethers";
import abi from "./ABI.json";
import erc20abi from "./ERC20ABI.json";

export const Ethereum = {
    // the contract that's already deployed
    // may need to change this in the future when changing the smart contract.
    contractAddress: "0xa10559Db939c5158098c480cda6105e8C805fB10",
    abi,
    mintTTC: async (amount: string, signer: any) => {
        try {
            const contract = new ethers.Contract(
                Ethereum.contractAddress,
                Ethereum.abi,
                signer
            );
            const amountInWei = ethers.utils.parseEther(amount);
            const tx = await contract.mint({ value: amountInWei });
            return tx;
        } catch (error: any) {
            console.log(error);
        }
    },
    redeemTTC: async (amount: string, signer: any) => {
        try {
            const contract = new ethers.Contract(
                Ethereum.contractAddress,
                Ethereum.abi,
                signer
            );
            const tx = await contract.redeem(
                (Number(amount) * 10 ** 18).toString()
            );
            return tx;
        } catch (error: any) {
            console.log(error);
        }
    },
    getVaultTokens: async (signer) => {
        try {
            const contract = new ethers.Contract(
                Ethereum.contractAddress,
                Ethereum.abi,
                signer
            );
            const data = await contract.getVaultData();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    },
    getTable: (tokens) => {
        let data: any[] = [];
        tokens.forEach((token, index) => {
            if (token[4].toString() !== "0") {
                data.push({
                    id: index,
                    name: token[0],
                    address: token[3],
                    percentage: token[4].toString() + "%",
                    amount:
                        Number(
                            ethers.utils.formatUnits(token[5], token[2])
                        ).toFixed(4) +
                        " " +
                        token[1],
                });
            }
        });
        return data;
    },
    getPie: (tokens) => {
        let data: any[] = [];
        tokens.forEach((token, index) => {
            if (token[4].toString() !== "0") {
                data.push({
                    label: token[0],
                    value: Number(token[4].toString()) / 100,
                });
            }
        });
        console.log(data);
        return data;
    },
    getTtcAddress: async (signer) => {
        try {
            const contract = new ethers.Contract(
                Ethereum.contractAddress,
                Ethereum.abi,
                signer
            );
            const data = await contract.getTtcTokenAddress();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    },
    getBalance: async (address, signer) => {
        try {
            const contract = new ethers.Contract(
                await Ethereum.getTtcAddress(signer),
                erc20abi,
                signer
            );
            const data = await contract.balanceOf(address);
            console.log(ethers.utils.formatUnits(data, 18));
            return ethers.utils.formatUnits(data, 18);
        } catch (error) {
            console.error(error);
        }
    },
    getTTCSupply: async (signer) => {
        try {
            const contract = new ethers.Contract(
                await Ethereum.getTtcAddress(signer),
                erc20abi,
                signer
            );
            const data = await contract.totalSupply();
            console.log(ethers.utils.formatUnits(data, 18));
            return ethers.utils.formatUnits(data, 18);
        } catch (error) {
            console.error(error);
        }
    },
};
