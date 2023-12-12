interface Ethereum {
    isMetaMask?: boolean;
    request?: (args: { method: string; params?: any[] }) => Promise<any>;
    // Add any other properties or methods you expect to use
  }
  
interface Window {
    ethereum?: Ethereum;
}
  