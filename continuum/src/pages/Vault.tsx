// Vault.js
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import { Ethereum } from '../helpers/Ethereum';
import { useAccount } from '../context/AccountContext'
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from 'antd/es/typography/Typography';


const columns = [
  { field: 'name', headerName: 'Name', width: 250 },
  {
    field: 'address',
    headerName: 'Address',
    width: 400,
  },
  {
    field: 'percentage',
    headerName: 'Allocation',
    width: 150,
  },
  {
    field: 'amount',
    headerName: 'Holdings',
    width: 250
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Vault() {
  const { connected, account, provider, signer } = useAccount();
  const [tableData, setTableData] = useState([])
  const [pieData, setPieData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const data = await Ethereum.getVaultTokens(signer)
      const table = Ethereum.getTable(data)
      const pie = Ethereum.getPie(data)
      const ttcAddress = Ethereum.getTtcAddress(signer)
      console.log(Ethereum.getBalance(account,signer))
      console.log(Ethereum.getTTCSupply(signer))
      console.log(ttcAddress)
      setTableData(table)
      setPieData(pie)
    }
    if (connected) {
      getData()
    }
    
  }, [connected])

  return (
    <Box sx={{ flexGrow: 1, margin:'3%' }}>
      <Grid container spacing={2} direction={'row'}> 
      <Grid item xs={4} md={4}>
          <Item>
            <Typography style={{color: 'white', fontSize: 'large', margin: "2%"}}>Allocation</Typography>
            <Box>
          {pieData.length != 0 ? 
          <PieChart 
          series={[
            {
              data: pieData,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 150,
              cy: 150,
              highlightScope: { faded: 'global', highlighted: 'item' },
          }]}
          height={300}
          
        />
          : <></>}
          </Box>
          </Item>
        </Grid>
        <Grid item xs={8} md={8}>
        <Item>
        <Typography style={{ color: 'white', fontSize: 'large', margin: '2%' }}>
          Constituents
        </Typography>
        <div style={{ width: '100%', alignContent:'center', overflowX: 'auto' }}>
          <DataGrid
            autoHeight
            rows={tableData}
            loading={tableData.length === 0}
            
            style={{ borderColor: 'rgb(84, 116, 116)', alignItems: 'centered', width: '100%', minWidth: '500px' }}
            columns={columns.map(column => ({
              ...column,
              flex: 1, // disable flex so that the column can shrink
              minWidth: 100, // set a minimum width for the column
            }))}
            // ... other DataGrid properties
          />
        </div>
      </Item>
        </Grid>

      </Grid>
    </Box>
  );
}

export default Vault;
