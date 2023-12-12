
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from '@web3modal/ethers5/react'
import { useAccount  } from '../context/AccountContext'
import { useEffect } from 'react'


export function ConnectButton() {
    // 4. Use modal hook
  const account = useWeb3ModalAccount();
  const {setAccount, setProvider, setSigner, setConnected } = useAccount();

  const {signer} = useWeb3ModalSigner();
  

  useEffect(() => {
    // This will be triggered whenever `account.address` or `signer` changes.
    const address = account?.address ?? null;
    setAccount(address);
  
    // If the signer is available, set it and derive the provider from it.
    if (signer) {
      setSigner(signer);
      setProvider(signer.provider);
      setConnected(true);
    } else {
      // If the signer is not available, reset both signer and provider to null.
      setConnected(false)
      setSigner(null);
      setProvider(null);
    }
  }, [account?.address, signer]);
  
  return (
    <>
      <w3m-button />
    </>
  )
}

export default function Login(){
  return<ConnectButton></ConnectButton>
}