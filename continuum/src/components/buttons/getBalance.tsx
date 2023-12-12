import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useAccount } from '../../context/AccountContext'; // Adjust the import path as needed
import { getBalance } from '../../helpers/ethersgetBalance'; // Adjust the import path to where your getBalance function is

const BalanceComponent: React.FC = () => {
  const [balance, setBalance] = useState<string>('');
  const { account,signer,provider } = useAccount(); // useAccount hook to access the provider from context
  
  const handleGetBalance = async () => {
    if (signer?.provider) {
      try {
        // Use the getBalance function and pass the provider from the context
        const balance = await getBalance(signer?.provider);
        setBalance(balance);
      } catch (error) {
        console.error(error);
        setBalance('Error fetching balance');
      }
    } else {
      setBalance('No provider available.');
    }
  };

  return (
    <div>
      
      <button onClick={handleGetBalance}>Get Balance</button>
      <p>Balance: {balance} LINK</p>
    </div>
  );
};

export default BalanceComponent;