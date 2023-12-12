import React, { useState } from 'react';
import { Box, Card, CardContent, Tab, Tabs, TextField, Button, InputAdornment } from '@mui/material';
import { Icon } from '@iconify/react';
import Typography from '@mui/material/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Placeholder for ETH logo
import EthLogo from '../assets/eth.svg'
import Logo from '../assets/continuum.svg'
import { useAccount } from '../context/AccountContext';
import { Ethereum } from "../helpers/Ethereum"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress } from '@mui/material';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function MintRedeem() {
  const { connected, account, provider, signer } = useAccount();
  const [selectedTab, setSelectedTab] = useState(0);
  const [ethAmount, setEthAmount] = useState('');
  const [ttcAmount, setTtcAmount] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [txMessage, setTxMessage] = useState('');
  const [txStatus, setTxStatus] = useState(1);
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState('');



  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleEthAmountChange = (event) => {
    setEthAmount(event.target.value);
  };

  const handleTtcAmountChange = (event) => {
    setTtcAmount(event.target.value);
  };

  const handleMint = async () => {
    try {
      setTxHash("");
      setProgress(0)
      setTxStatus(1);
      setTxMessage('Creating transaction...');
  
      const tx = await Ethereum.mintTTC(ethAmount, signer);
      setDialogOpen(true);
      setTxHash(tx.hash);
      setProgress(50)
      setTxMessage('Transaction sent, waiting for confirmation...');
      console.log(tx.hash);
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      setTxStatus(receipt.status)
      setProgress(100)
      if (receipt.status) setTxMessage('Transaction Confirmed!');
      else setTxMessage('Transaction Reverted!');
  
      console.log(receipt);
    } catch (error) {
      setDialogOpen(false);
      setTxStatus(0)
      console.error('Minting failed:', error);
      setTxMessage('Minting failed!');
    }
  };
  

  const handleRedeem = async () => {
    try {
      setTxHash("");
      setProgress(0)
      setTxStatus(1);
      setTxMessage('Creating transaction...');
  
      const tx = await Ethereum.redeemTTC(ttcAmount, signer);
      setDialogOpen(true);
      setTxHash(tx.hash);
      setProgress(50)
      setTxMessage('Transaction sent, waiting for confirmation...');
      console.log(tx.hash);
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      setTxStatus(receipt.status)
      setProgress(100)
      if (receipt.status) setTxMessage('Transaction Confirmed!');
      else setTxMessage('Transaction Reverted!');
  
      console.log(receipt);
    } catch (error) {
      setDialogOpen(false);
      setTxStatus(0)
      console.error('Minting failed:', error);
      setTxMessage('Minting failed!');
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleViewTx = () => {
    const txUrl = `https://goerli.etherscan.io/tx/${txHash}`;
    window.open(txUrl, '_blank');
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height: '100vh' }}>
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Transaction Status</DialogTitle>
        {txStatus ? 
              <>
                  <DialogContent>
                  <DialogContentText>{txMessage}</DialogContentText>
                  <LinearProgress variant="determinate" value={progress}/>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>OK</Button>
                  <Button onClick={handleViewTx} color="primary">View TX</Button>
                </DialogActions>
              </>
              :
              <>
                <DialogContent>
                <DialogContentText>{txMessage}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>OK</Button>
              </DialogActions>
            </>
        }
      </Dialog>

      <Card sx={{ width:"25%", marginBottom:'20%' }}>
        <CardContent>
          <Tabs value={selectedTab} onChange={handleChange} centered>
            <Tab label="Mint" />
            <Tab label="Redeem" />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <TextField
              fullWidth
              type="number"
              label="Amount of ETH"
              variant="outlined"
              value={ethAmount}
              onChange={handleEthAmountChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon color='rgb(84, 116, 116)'  height="30px" width="30px" icon="mdi:ethereum" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleMint} disabled={!connected}>
              Mint
            </Button>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <TextField
              fullWidth
              type="number"
              label="Amount of TTC"
              variant="outlined"
              value={ttcAmount}
              onChange={handleTtcAmountChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img src={Logo} alt="Continuum Logo" height="30px" width="30px"
          
                    />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleRedeem}  disabled={!connected}>
              Redeem
            </Button>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}

export default MintRedeem;
