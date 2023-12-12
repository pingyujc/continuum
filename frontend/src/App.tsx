import React from 'react';
import Header from './components/nav/Header';
import { AccountProvider } from './context/AccountContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MintRedeem from './pages/MintRedeem';
import Vault from './pages/Vault';
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from '@web3modal/ethers5/react'
import coinBaseLogo from './assets/CoinbaseIcon.svg'
import walletConnectLogo from './assets/walletConnectIcon.svg'
import userProfilePicture from './assets/logo.png'


// 1. Get projectId
const projectId = 'Continuum'

// 2. Set chains
const chains = [1,5]
  

const ethersConfig = defaultConfig({
  metadata: {
    name: 'Continuum',
    description: 'On Chain ERC-20 etf',
    url: 'https://continuum.io',
    icons: [userProfilePicture],
    
  },
  defaultChainId: 1,
  rpcUrl: 'https://cloudflare-eth.com',
  enableCoinbase: true,
  enableEIP6963: true,
  enableInjected: false,
})

createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  connectorImages: {
    coinbaseWallet: coinBaseLogo,
    walletConnect: walletConnectLogo,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'rgb(84, 116, 116)',
    '--w3m-color-mix': 'rgb(84, 116, 116)',
    '--w3m-color-mix-strength': 20,
    '--w3m-font-family': 'Basel, Arial, sans-serif'
  }
})



function App() {
  return (
    <AccountProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<MintRedeem />} />
          <Route path="/vault" element={<Vault />} />
        </Routes>
    </Router>
    </ThemeProvider>
    </AccountProvider>
  );
}
export default App;
