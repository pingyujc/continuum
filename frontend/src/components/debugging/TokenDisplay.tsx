import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount } from '../../context/AccountContext'; // Adjust the import path as necessary
import { TokenData } from '../../types/types';

// The wallet address you want to check
const walletAddress = '0x76473401942dF748DD34B4329FD53f611752F371'; // Replace with the actual wallet address
const tokenAddresses = {
  'Link': ['0x326C977E6efc84E512bB9C30f76E30c160eD06FB', 18],
 // 'RareTrx.xyz': ['0x0a927B96647a4a1fB231F39A7497E169c78db7c5', 18],
  'Uniswap': ['0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18],
  'WETH': ['0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18]
};
// The ERC20 Token ABI fragment containing just the balanceOf function
const abi = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];


async function getBalance(provider: ethers.providers.JsonRpcProvider, tokenAddress: string, decimals: number): Promise<string> {
  const contract = new ethers.Contract(tokenAddress, abi, provider);
  const balance = await contract.balanceOf(walletAddress);
  return ethers.utils.formatUnits(balance, decimals);
}
export async function getTokenBalancesMap(provider: ethers.providers.JsonRpcProvider): Promise<TokenData[]> {
  const tokenBalancesArray: TokenData[] = [];
  let id = 0;

  for (const tokenName in tokenAddresses) {
    const [tokenAddress, decimals] = tokenAddresses[tokenName];
    try {
      const balance = await getBalance(provider, tokenAddress, decimals);
      tokenBalancesArray.push({
        id: id++,
        value: parseFloat(balance),
        label: tokenName
      });
    } catch (error) {
      console.error(`Error fetching balance for ${tokenName}:`, error);
      // Handle error case, possibly by pushing an error state or skipping
    }
  }

  return tokenBalancesArray;
}
  const TokenBalancesDisplay: React.FC = () => {
    const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>({});
    const { provider, account } = useAccount();
  
    useEffect(() => {
      const fetchBalances = async () => {
        if (provider && account) {
          try {
            const balances: { [key: string]: string } = {};
  
            for (const tokenName in tokenAddresses) {
              const balance = await getBalance(provider, tokenAddresses[tokenName][0], tokenAddresses[tokenName][1]);
              balances[tokenName] = balance;
            }
  
            setTokenBalances(balances);
          } catch (error) {
            console.error('Error fetching token balances:', error);
          }
        }
      };
  
      fetchBalances();
    }, [provider, account]);
  
    return (
      <div>
        <h3>Token Balances</h3>
        {Object.keys(tokenBalances).map(tokenName => (
          <p key={tokenName}>{tokenName} Balance: {tokenBalances[tokenName]} tokens</p>
        ))}
      </div>
    );
  };

export default TokenBalancesDisplay;