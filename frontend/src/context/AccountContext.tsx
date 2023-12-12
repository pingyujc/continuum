// AccountContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

// Define the shape of the context state
interface AccountContextState {
  connected: boolean | null;
  setConnected: (connected: boolean | null) => void;
  account: string | null;
  setAccount: (account: string | null) => void;
  provider: ethers.providers.JsonRpcProvider | null;
  setProvider: (provider: ethers.providers.JsonRpcProvider | null) => void;
  signer: ethers.providers.JsonRpcSigner | null;
  setSigner: (signer: ethers.providers.JsonRpcSigner | null) => void;
}

// Create a context with a default undefined state
const AccountContext = createContext<AccountContextState | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);

  // value object that will be provided to consumers
  const value = {
    account,
    setAccount,
    provider,
    setProvider,
    signer,
    setSigner,
    connected,
    setConnected
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextState => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};