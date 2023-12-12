import { ethers } from 'ethers';
import { ContractInterface } from 'ethers';

// This is your ABI as a ContractInterface type.
const abi: ContractInterface = [
    
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "usdcAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "ttcAmount",
              "type": "uint256"
            }
          ],
          "name": "Minted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "ttcAmount",
              "type": "uint256"
            }
          ],
          "name": "Redemption",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "continuumFee",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "continuumTreasury",
          "outputs": [
            {
              "internalType": "address payable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCurrentAssetBalances",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "mint",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "poolFee",
          "outputs": [
            {
              "internalType": "uint24",
              "name": "",
              "type": "uint24"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "redeem",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "swapRouter",
          "outputs": [
            {
              "internalType": "contract ISwapRouter",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "ttcToken",
          "outputs": [
            {
              "internalType": "contract TTC",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "wethAddress",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
]  

// Provided contract address
const contractAddress = '0x76473401942dF748DD34B4329FD53f611752F371';

// A utility function to call a method on the provided contract
export async function callContractMethod({
  methodName,
  args,
  signer,
  provider,
}: {
  methodName: string;
  args?: any[];
  signer?: ethers.Signer;
  provider?: ethers.providers.Provider;
}) {
  // A signer or provider is necessary to interact with the contract
  if (!signer && !provider) {
    throw new Error('A signer or provider is required to interact with the contract');
  }

  const contract = new ethers.Contract(contractAddress, abi, signer || provider);

  // Check if the contract has the method we're trying to call
  if (typeof contract[methodName] !== 'function') {
    throw new Error(`Method ${methodName} not found on the contract`);
  }

  try {
    // Use .apply to call the method with an array of arguments
    const response = await contract[methodName](...args || []);
    return response;
  } catch (error) {
    console.error(`Failed to call method ${methodName} on contract: `, error);
    throw error;
  }
}

// Example usage:
// callContractMethod({
//   methodName: 'continuumTreasury',
//   provider: new ethers.providers.JsonRpcProvider('your_rpc_url'),
// }).then((treasuryAddress) => {
//   console.log('Treasury Address:', treasuryAddress);
// });