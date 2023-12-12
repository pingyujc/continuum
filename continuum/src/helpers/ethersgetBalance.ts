import { ethers } from "ethers";
// The address of the ERC20 token (LINK in this case) on the Ethereum network
const tokenAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'; // Replace with the actual contract address

// The wallet address you want to check
const walletAddress = '0x76473401942dF748DD34B4329FD53f611752F371'; // Replace with the actual wallet address

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



export async function getBalance(AccountProvider): Promise<string>{
  const contract = new ethers.Contract(tokenAddress,abi,AccountProvider.provider)
  const balance = await contract.balanceOf(walletAddress);
  console.log(ethers.utils.formatUnits(balance, 18))
  return ethers.utils.formatUnits(balance, 18);
}